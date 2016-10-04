import {PH} from "../config/PH";
import {
	EntityMetadata, RelationType, CascadeType, IEntity, PHQuery, QEntity, QDateField,
	SQLStringQuery, PHSQLQuery, SQLDialect, SQLStringDelete, PHSQLDelete, PHSQLUpdate, SQLStringUpdate
} from "querydsl-typescript";
import {PHMetadataUtils, NameMetadataUtils} from "../core/metadata/PHMetadataUtils";
import {Observable, Subject} from "rxjs";
import {IdGenerator, IdGeneration, getIdGenerator} from "./IdGenerator";
import {UpdateCache} from "../core/repository/UpdateCache";
import {ChangeGroupApi} from "../changeList/model/ChangeGroup";
import {IEntityChange} from "../changeList/model/EntityChange";
import {IEntityManager} from "../core/repository/EntityManager";
import {LocalStoreType, LocalStoreSetupInfo} from "./LocalStoreApi";
import {ILocalStoreAdaptor} from "./LocalStoreAdaptor";
import {PHDelete} from "querydsl-typescript/lib/query/PHQuery";
import {IAbstractEntityChange} from "../changeList/model/AbstractEntityChange";
import {IEntityWhereChange} from "../changeList/model/EntityWhereChange";
/**
 * Created by Papa on 9/9/2016.
 */

export interface CascadeRecord {
	entityName: string;
	mappedBy: string;
	manyEntity: any;
	cascadeType: 'create' | 'remove' | 'update';
}

export interface RemovalRecord {
	array: any[];
	index: number;
}

export abstract class SqlAdaptor implements ILocalStoreAdaptor {

	public type: LocalStoreType;

	protected idGenerator: IdGenerator;

	protected currentChangeGroup: ChangeGroupApi;

	constructor(
		protected entityManager: IEntityManager,
		idGeneration: IdGeneration
	) {
		this.idGenerator = getIdGenerator(idGeneration);
	}

	abstract initialize(
		setupInfo: LocalStoreSetupInfo
	): Promise<any>;

	abstract wrapInTransaction(callback: ()=> Promise<any>): Promise<any>;

	private verifyChangeGroup() {
		if (this.currentChangeGroup == null) {
			throw `Current change group is not defined`;
		}
	}

	get activeChangeGroup(): ChangeGroupApi {
		return this.currentChangeGroup;
	}

	async create<E>(
		entityName: string,
		entity: E,
		changeGroup: ChangeGroupApi
	): Promise<IEntityChange> {

		let qEntity = PH.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityRelationMap = PH.entitiesRelationPropertyMap[entityName];

		if (!entityMetadata.idProperty) {
			throw `@Id is not defined for entity: ${entityName}`;
		}

		if (entity[entityMetadata.idProperty]) {
			throw `Cannot create entity: ${entityName}, id is already defined to be: ${entityMetadata.idProperty}`;
		}
		let entityChange = changeGroup.addNewCreateEntityChange(entityName, entity, entityMetadata.idProperty, this.idGenerator);

		let columnNames: string[] = [];
		let values: any[] = [];
		let cascadeRecords: CascadeRecord[] = [];
		for (let propertyName in entity) {
			let columnName = PHMetadataUtils.getPropertyColumnName(propertyName, qEntity);
			let field = qEntity.__entityFieldMap__[propertyName];
			if (columnName) {
				columnNames.push(columnName);
				let newValue = entity[propertyName];
				values.push(entity[propertyName]);
				entityChange.addNewFieldChange(propertyName, null, newValue, field);
				continue;
			}
			let nonPropertyValue = entity[propertyName];
			// If there is no value then it doesn't have to be created
			if (!nonPropertyValue && nonPropertyValue !== '' && nonPropertyValue !== 0) {
				continue;
			}
			columnName = PHMetadataUtils.getJoinColumnName(propertyName, qEntity);
			// if there is no entity data on in, don't process it (transient field)
			if (!columnName) {
				return;
			}
			// If it's not an object/array
			if (typeof nonPropertyValue != 'object' || nonPropertyValue instanceof Date) {
				throw `Unexpected value in relation property: ${propertyName}, of entity ${entityName}`;
			}
			let entityRelation = entityRelationMap[propertyName];
			switch (entityRelation.relationType) {
				case RelationType.MANY_TO_ONE:
					if (nonPropertyValue instanceof Array) {
						throw `@ManyToOne relation cannot be an array`;
					}
					// get the parent object's id
					let parentObjectIdValue = NameMetadataUtils.getIdValue(entityRelation.entityName, nonPropertyValue);
					if (!parentObjectIdValue) {
						throw `Parent object's (${entityRelation.entityName}) @Id value is missing `;
					}
					columnNames.push(columnName);
					values.push(parentObjectIdValue);
					entityChange.addNewFieldChange(propertyName, null, parentObjectIdValue, field);
					// Cascading on manyToOne is not currently implemented, nothing else needs to be done
					continue;
				case RelationType.ONE_TO_MANY:
					if (!(nonPropertyValue instanceof Array)) {
						throw `@OneToMany relation must be an array`;
					}
					let oneToManyConfig = PHMetadataUtils.getOneToManyConfig(propertyName, qEntity);
					let cascadeType = oneToManyConfig.cascade;
					switch (cascadeType) {
						case CascadeType.ALL:
						case CascadeType.PERSIST:
							// Save for cascade operation
							for (let manyEntity in nonPropertyValue) {
								cascadeRecords.push({
									entityName: entityRelation.entityName,
									mappedBy: oneToManyConfig.mappedBy,
									manyEntity: manyEntity,
									cascadeType: 'create'
								});
							}
					}
					break;
			}
		}

		await this.createNative(qEntity, columnNames, values, cascadeRecords, changeGroup);

		return entityChange;
	}

	protected abstract async createNative(
		qEntity: QEntity<any>,
		columnNames: string[],
		values: any[],
		cascadeRecords: CascadeRecord[],
		changeGroup: ChangeGroupApi
	);

	async delete<E>(
		entityName: string,
		entity: E,
		changeGroup: ChangeGroupApi
	): Promise<IEntityChange> {

		let qEntity = PH.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityRelationMap = PH.entitiesRelationPropertyMap[entityName];

		if (!entityMetadata.idProperty) {
			throw `@Id is not defined for entity: ${entityName}`;
		}

		let idValue = entity[entityMetadata.idProperty];
		if (!idValue) {
			throw `Cannot delete entity: ${entityName}, id is not set.`;
		}

		let cascadeRecords: CascadeRecord[] = [];
		let removalRecords: RemovalRecord[] = [];
		for (let propertyName in entity) {
			let entityRelation = entityRelationMap[propertyName];
			// Only check relationships
			if (!entityRelation) {
				continue;
			}
			let nonPropertyValue = entity[propertyName];
			// skip blank relations
			if (!nonPropertyValue) {
				continue;
			}
			// If it's not an object/array it's invalid
			if (typeof nonPropertyValue != 'object' || nonPropertyValue instanceof Date) {
				throw `Entity relation ${entityName}.${propertyName} is not an object or an array`;
			}
			switch (entityRelation.relationType) {
				case RelationType.MANY_TO_ONE:
					if (nonPropertyValue instanceof Array) {
						throw `@ManyToOne relation cannot be an array`;
					}
					// get the parent object's related OneToMany
					let parentObjectIdValue = NameMetadataUtils.getIdValue(entityRelation.entityName, nonPropertyValue);
					let relatedOneToMany = NameMetadataUtils.getRelatedOneToManyConfig(propertyName, entityRelation.entityName);
					if (!relatedOneToMany || !relatedOneToMany.config.orphanRemoval) {
						continue;
					}
					let relatedObject = entity[propertyName];
					let relatedObjectManyReference = relatedObject[relatedOneToMany.propertyName];
					for (let i = 0; i < relatedObjectManyReference.length; i++) {
						if (relatedObjectManyReference[i] === entity) {
							removalRecords.push({
								array: relatedObjectManyReference,
								index: i
							});
							break;
						}
					}
					// Cascading on manyToOne is not currently implemented, nothing else needs to be done
					continue;
				case RelationType.ONE_TO_MANY:
					if (!(nonPropertyValue instanceof Array)) {
						throw `@OneToMany relation must be an array`;
					}
					let oneToManyConfig = PHMetadataUtils.getOneToManyConfig(propertyName, qEntity);
					let cascadeType = oneToManyConfig.cascade;
					switch (cascadeType) {
						case CascadeType.ALL:
						case CascadeType.REMOVE:
							// Save for cascade operation
							for (let manyEntity in nonPropertyValue) {
								cascadeRecords.push({
									entityName: entityRelation.entityName,
									mappedBy: oneToManyConfig.mappedBy,
									manyEntity: manyEntity,
									cascadeType: 'remove'
								});
							}
					}
					break;
			}
		}

		let entityChange = await this.deleteNative(qEntity, entity, idValue, cascadeRecords, changeGroup);

		removalRecords.forEach((removalRecord) => {
			// Remove the deleted object from the related @ManyToOne objects array reference
			removalRecord.array.splice(removalRecord.index, 1);
		});

		return entityChange;
	}

	protected abstract async deleteNative(
		qEntity: QEntity<any>,
		entity: any,
		idValue: number | string,
		cascadeRecords: CascadeRecord[],
		changeGroup: ChangeGroupApi
	);

	async deleteWhere<IE extends IEntity>(
		entityName: string,
		phSqlDelete: PHSQLDelete<IE>,
		changeGroup: ChangeGroupApi
	): Promise<void> {
		let sqlStringDelete: SQLStringDelete<IE> = new SQLStringDelete<IE>(phSqlDelete.toSQL(), phSqlDelete.qEntity, phSqlDelete.qEntityMap, phSqlDelete.entitiesRelationPropertyMap, phSqlDelete.entitiesPropertyTypeMap, this.getDialect());
		await this.deleteWhereNative(sqlStringDelete, changeGroup);
	}

	protected abstract async deleteWhereNative<IE extends IEntity>(
		sqlStringDelete: SQLStringDelete<IE>,
		changeGroup: ChangeGroupApi
	):Promise<IEntityWhereChange>;

	async update<E>(
		entityName: string,
		entity: E,
		changeGroup: ChangeGroupApi
	): Promise<IEntityChange> {
		/**
		 * On an update operation, can a nested create contain an update?
		 * Via:
		 *  OneToMany:
		 *    Yes, if the child entity is itself in the update cache
		 *  ManyToOne:
		 *    Cascades do not travel across ManyToOne
		 */
		let qEntity = PH.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityRelationMap = PH.entitiesRelationPropertyMap[entityName];

		if (!entityMetadata.idProperty) {
			throw `@Id is not defined for entity: ${entityName}`;
		}

		let idValue = entity[entityMetadata.idProperty];
		if (!idValue) {
			throw `Cannot update entity: ${entityName}, id is not set.`;
		}


		let entityChange = changeGroup.addNewUpdateEntityChange(entityName, entity, entityMetadata.idProperty);

		let updateCache = UpdateCache.getEntityUpdateCache(entityName, entity);

		let columnNames: string[] = [];
		let values: any[] = [];
		let cascadeRecords: CascadeRecord[] = [];
		for (let propertyName in entity) {
			let field = qEntity.__entityFieldMap__[propertyName];
			let columnName = PHMetadataUtils.getPropertyColumnName(propertyName, qEntity);
			// If the property is not a transient field and not a relation
			if (columnName) {
				let updatedValue = entity[propertyName];
				if (typeof updatedValue === 'object' && updatedValue) {
					if (!(qEntity[propertyName] instanceof QDateField)) {
						throw `Unexpected object type in property: ${propertyName}, of entity: ${entityName}`;
					}
					if (!(updatedValue instanceof Date)) {
						throw `Unexpected object in property: ${propertyName}, of entity: ${entityName}`;
					}
				}
				if (updateCache) {
					let originalValue = updateCache[propertyName];
					if (!UpdateCache.valuesEqualIgnoreObjects(originalValue, updatedValue)) {
						columnNames.push(columnName);
						values.push(updatedValue);
						entityChange.addNewFieldChange(propertyName, originalValue, updatedValue, field);

					}
				} else {
					columnNames.push(columnName);
					values.push(updatedValue);
					entityChange.addNewFieldChange(propertyName, null, updatedValue, field);
				}
				continue;
			}
			let nonPropertyValue = entity[propertyName];
			columnName = PHMetadataUtils.getJoinColumnName(propertyName, qEntity);
			// if there is no entity data on in, don't process it (transient field)
			if (!columnName) {
				return;
			}
			// If it's not an object/array
			if (typeof nonPropertyValue != 'object' || nonPropertyValue instanceof Date) {
				throw `Unexpected value in relation property: ${propertyName}, of entity ${entityName}`;
			}
			let entityRelation = entityRelationMap[propertyName];
			switch (entityRelation.relationType) {
				case RelationType.MANY_TO_ONE:
					if (nonPropertyValue instanceof Array) {
						throw `@ManyToOne relation cannot be an array`;
					}
					// get the parent object's id
					let parentObjectIdValue = NameMetadataUtils.getIdValue(entityRelation.entityName, nonPropertyValue);
					if (!parentObjectIdValue) {
						throw `Parent object's (${entityRelation.entityName}) @Id value is missing `;
					}
					if (updateCache) {
						let originalValue = updateCache[propertyName];
						if (!UpdateCache.valuesEqualIgnoreObjects(originalValue, parentObjectIdValue)) {
							columnNames.push(columnName);
							values.push(parentObjectIdValue);
							entityChange.addNewFieldChange(propertyName, originalValue, parentObjectIdValue, field);

						}
					} else {
						columnNames.push(columnName);
						values.push(parentObjectIdValue);
						entityChange.addNewFieldChange(propertyName, null, parentObjectIdValue, field);
					}
					// Cascading on manyToOne is not currently implemented, nothing else needs to be done
					continue;
				case RelationType.ONE_TO_MANY:
					if (!(nonPropertyValue instanceof Array)) {
						throw `@OneToMany relation must be an array`;
					}
					let oneToManyConfig = PHMetadataUtils.getOneToManyConfig(propertyName, qEntity);
					let cascadeType = oneToManyConfig.cascade;
					switch (cascadeType) {
						case CascadeType.ALL:
						case CascadeType.MERGE:
							// Save for cascade operation
							for (let manyEntity in nonPropertyValue) {
								let parentObjectIdValue = NameMetadataUtils.getIdValue(entityRelation.entityName, manyEntity);
								// If the child record does not exist, cascade a create operation
								if (!parentObjectIdValue) {
									cascadeRecords.push({
										entityName: entityRelation.entityName,
										mappedBy: oneToManyConfig.mappedBy,
										manyEntity: manyEntity,
										cascadeType: 'create'
									});
								} else {
									let updateCache = UpdateCache.getEntityUpdateCache(entityName, entity);
									// Cannot cascade update operations without an update cache
									if (!updateCache) {
										continue;
									}
									cascadeRecords.push({
										entityName: entityRelation.entityName,
										mappedBy: oneToManyConfig.mappedBy,
										manyEntity: manyEntity,
										cascadeType: 'update'
									});
								}
							}
					}
					break;
			}
		}

		await this.updateNative(
			qEntity,
			columnNames,
			values,
			entityMetadata.idProperty,
			idValue,
			cascadeRecords,
			changeGroup);

		return entityChange;
	}

	protected abstract async updateNative(
		qEntity: QEntity<any>,
		columnNames: string[],
		values: any[],
		idProperty: string,
		idValue: number | string,
		cascadeRecords: CascadeRecord[],
		changeGroup: ChangeGroupApi
	);

	async updateWhere<IE extends IEntity>(
		entityName: string,
		phSqlUpdate: PHSQLUpdate<IE>,
		changeGroup: ChangeGroupApi
	): Promise<void> {
		let sqlStringUpdate: SQLStringUpdate<IE> = new SQLStringUpdate<IE>(phSqlUpdate.toSQL(), phSqlUpdate.qEntity, phSqlUpdate.qEntityMap, phSqlUpdate.entitiesRelationPropertyMap, phSqlUpdate.entitiesPropertyTypeMap, this.getDialect());
		await this.updateWhereNative(sqlStringUpdate, changeGroup);
	}

	protected abstract async updateWhereNative<IE extends IEntity>(
		sqlStringUpdate: SQLStringUpdate<IE>,
		changeGroup: ChangeGroupApi
	):Promise<IEntityWhereChange>;

	async find < E, IE extends IEntity >(
		entityName: string,
		phSqlQuery: PHSQLQuery < IE >
	): Promise < E[] > {
		let query: SQLStringQuery<IE> = new SQLStringQuery<IE>(phSqlQuery.toSQL(), phSqlQuery.qEntity, phSqlQuery.qEntityMap, phSqlQuery.entitiesRelationPropertyMap, phSqlQuery.entitiesPropertyTypeMap, this.getDialect());
		let parameters = [];
		let sql = query.toSQL(true, parameters);
		let rawResults = await this.findNative(sql, parameters);
		return query.parseQueryResults(rawResults);
	}

	protected abstract getDialect(): SQLDialect;

	protected abstract async findNative(
		sqlQuery: string,
		parameters: any[]
	): Promise<any[]>;

	async  findOne < E, IE  extends IEntity >(
		entityName: string,
		phSqlQuery: PHSQLQuery < IE >
	): Promise < E > {
		let results = await this.find(entityName, phSqlQuery);

		if (results.length > 0) {
			throw `Expecting a single result, got ${results.length}`;
		}
		if (results.length == 1) {
			return <E>results[0];
		}
		return null;
	}

	async save<E>(
		entityName: string,
		entity: E,
		changeGroup: ChangeGroupApi
	): Promise < IEntityChange > {
		let qEntity = PH.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		if (!entityMetadata.idProperty) {
			throw `@Id is not defined for entity: ${entityName}`;
		}

		if (entity[entityMetadata.idProperty]) {
			return await this.update(entityName, entity, changeGroup);
		} else {
			return await this.create(entityName, entity, changeGroup);
		}
	}

	search < E, IE extends IEntity >(
		entityName: string,
		phSqlQuery: PHSQLQuery < IE >,
		subject ?: Subject < E[] >
	): Observable < E[] > {
		if (!subject) {
			subject = new Subject<E[]>();
		}
		this.find(entityName, phSqlQuery).then((results: E[]) => {
			subject.next(results);
		});
		return subject;
	}

	searchOne < E, IE extends IEntity >(
		entityName: string,
		phQuery: PHQuery < IE >,
		subject ?: Subject < E >
	): Observable < E > {
		return null;
	}

	warn(
		message: string
	) {
		console.log(message);
	}

}