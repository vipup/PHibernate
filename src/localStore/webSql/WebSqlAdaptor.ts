import {LocalStoreAdaptor} from "../LocalStoreAdaptor";
import {LocalStoreSetupInfo} from "../LocalStoreApi";
import {IEntity, PHQuery, EntityMetadata, RelationType, CascadeType} from "querydsl-typescript";
import {Subject, Observable} from "rxjs";
import {PH} from "../../config/PH";
import {DDLManager} from "./DDLManager";
import {IdGenerator, IdGeneration, getIdGenerator} from "../IdGenerator";
import {PHMetadataUtils, NameMetadataUtils} from "../../core/metadata/PHMetadataUtils";

/**
 * Created by Papa on 8/30/2016.
 */

const DB_NAME: string = 'appStorage';
const win: any = window;

interface CascadeRecord {
	entityName: string;
	mappedBy: string;
	manyEntity: any;
}

interface RemovalRecord {
	array: any[];
	index: number;
}

export class WebSqlAdaptor implements LocalStoreAdaptor {

	static BACKUP_LOCAL = 2;
	static BACKUP_LIBRARY = 1;
	static BACKUP_DOCUMENTS = 0;

	private _db: any;

	private currentTransaction;
	private idGenerator: IdGenerator;

	constructor(idGeneration: IdGeneration) {
		this.idGenerator = getIdGenerator(idGeneration);
	}

	private getBackupLocation(dbFlag: number): number {
		switch (dbFlag) {
			case WebSqlAdaptor.BACKUP_LOCAL:
				return 2;
			case WebSqlAdaptor.BACKUP_LIBRARY:
				return 1;
			case WebSqlAdaptor.BACKUP_DOCUMENTS:
				return 0;
			default:
				throw Error('Invalid backup flag: ' + dbFlag);
		}
	}

	initialize(
		setupInfo: LocalStoreSetupInfo
	): Promise<any> {
		let dbOptions: any = {
			name: DB_NAME,
			backupFlag: WebSqlAdaptor.BACKUP_LOCAL,
			existingDatabase: false
		};

		if (win.sqlitePlugin) {
			let location = this.getBackupLocation(dbOptions.backupFlag);
			dbOptions.location = location;
			dbOptions.createFromLocation = dbOptions.existingDatabase ? 1 : 0;
			this._db = win.sqlitePlugin.openDatabase(dbOptions);
		} else {
			console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
			this._db = win.openDatabase(dbOptions.name, '1.0', 'database', 5 * 1024 * 1024);
		}

		return new Promise((resolve, reject) => {
			try {
				this._db.transaction((tx) => {
						this.initTable(tx, null, resolve, reject);
					},
					(err) => reject({err: err}));
			} catch (err) {
				reject({err: err});
			}
		});
	}

	wrapInTransaction(callback: ()=> Promise<any>): Promise<any> {
		let result;
		if (this.currentTransaction) {
			result = callback();
			if (!(result instanceof Promise)) {
				throw `A method with @Transactional decorator must return a promise`;
			}
			return result;
		}
		return new Promise((resolve, reject) => {
			try {
				this._db.transaction((tx) => {
						this.currentTransaction = tx;
						result = callback();
						if (!(result instanceof Promise)) {
							throw `A method with @Transactional decorator must return a promise`;
						}
						result.catch((error: any) => {
							reject(error);
						}).then((value: any)=> {
							this.currentTransaction = null;
							resolve(value);
						});
					},
					(err) => reject(err));
			} catch (err) {
				reject(err);
			}
		});
	}

	async query(query: string, params = [], saveTransaction: boolean = false): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				if (this.currentTransaction) {
					this.currentTransaction.executeSql(query, params,
						(tx, res) => resolve({tx: this.currentTransaction, res: res}),
						(tx, err) => reject({tx: this.currentTransaction, err: err}));
				} else {
					this._db.transaction((tx) => {
							if (saveTransaction) {
								this.currentTransaction = tx;
							}
							tx.executeSql(query, params,
								(tx, res) => resolve({tx: tx, res: res}),
								(tx, err) => reject({tx: tx, err: err}));
						},
						(err) => reject({err: err}));
				}
			} catch (err) {
				reject({err: err});
			}
		});
	}

	handleError(error: any) {
		throw error;
	}

	initTable(
		transaction,
		lastEntityName,
		resolve,
		reject
	) {
		let currentEntityName;
		for (let entityName in PH.qEntityMap) {
			if (!lastEntityName) {
				currentEntityName = entityName;
				break;
			}
			if (lastEntityName == entityName) {
				lastEntityName = null;
				break;
			}
		}
		if (currentEntityName) {

			let createTableDDL = DDLManager.getCreateTableDDL(currentEntityName);
			let params = [];
			transaction.executeSql(createTableDDL, params,
				(tx, res) => {
					this.initTable(transaction, currentEntityName, resolve, reject);
				},
				(tx, err) => reject({tx: tx, err: err}));
		} else {
			resolve({tx: transaction, res: 'DONE'});
		}

	}

	async create<E>(
		entityName: string,
		entity: E
	): Promise<void> {
		let qEntity = PH.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityRelationMap = PH.entitiesRelationPropertyMap[entityName];

		if (!entityMetadata.idProperty) {
			throw `@Id is not defined for entity: ${entityName}`;
		}

		if (entity[entityMetadata.idProperty]) {
			throw `Cannot create entity: ${entityName}, id is already defined to be: ${entityMetadata.idProperty}`;
		}

		entity[entityMetadata.idProperty] = this.idGenerator.generateId(<any>entityMetadata);

		let columnNames: string[] = [];
		let values: any[] = [];
		let cascadeRecords: CascadeRecord[] = [];
		for (let propertyName in entity) {
			let columnName = PHMetadataUtils.getPropertyColumnName(propertyName, qEntity);
			if (columnName) {
				columnNames.push(columnName);
				values.push(entity[propertyName]);
				continue;
			}
			let nonPropertyValue = entity[propertyName];
			if (!nonPropertyValue) {
				continue;
			}
			// If it's not an object/array, don't process it (must be a transient field)
			if (typeof nonPropertyValue != 'object' || nonPropertyValue instanceof Date) {
				continue;
			}
			columnName = PHMetadataUtils.getJoinColumnName(propertyName, qEntity);
			// if there is no entity data on in, don't process it (transient field)
			if (!columnName) {
				return;
			}
			let entityRelation = entityRelationMap[propertyName];
			switch (entityRelation.relationType) {
				case RelationType.MANY_TO_ONE:
					// get the parent object's id
					let parentObjectIdValue = NameMetadataUtils.getIdValue(entityRelation.entityName, nonPropertyValue);
					if (!parentObjectIdValue) {
						throw `Parent object's (${entityRelation.entityName}) @Id value is missing `;
					}
					columnNames.push(columnName);
					values.push(parentObjectIdValue);
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
									manyEntity: manyEntity
								});
							}
					}
					break;
			}
		}

		let valuesBindString = values.map(() => '?').join(', ');
		let tableName = PHMetadataUtils.getTableName(qEntity);
		let sql = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${valuesBindString})`;
		if (cascadeRecords.length) {
			let startTransaction = false;
			if (!this.currentTransaction) {
				startTransaction = true;
			}
			await this.query(sql, values, startTransaction);
			for (let i = 0; i < cascadeRecords.length; i++) {
				let cascadeRecord = cascadeRecords[i];
				await this.create(cascadeRecord.entityName, cascadeRecord.manyEntity);
			}
			if (startTransaction) {
				this.currentTransaction = null;
			}
		} else {
			await this.query(sql, values);
		}
	}

	async delete<E>(
		entityName: string,
		entity: E,
		startNewTransaction: boolean = false
	): Promise<void> {
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
									manyEntity: manyEntity
								});
							}
					}
					break;
			}
		}

		let startTransaction = startNewTransaction;
		let transactionExists = !!this.currentTransaction;
		if (cascadeRecords.length) {
			if (!transactionExists) {
				startTransaction = true;
			}
			for (let i = 0; i < cascadeRecords.length; i++) {
				let cascadeRecord = cascadeRecords[i];
				cascadeRecord.manyEntity[cascadeRecord.mappedBy] = entity;
				await this.delete(cascadeRecord.entityName, cascadeRecord.manyEntity, startTransaction);
			}
		}
		let tableName = PHMetadataUtils.getTableName(qEntity);
		let idColumnName = PHMetadataUtils.getPropertyColumnName(entityMetadata.idProperty, qEntity);
		let sql = `DELETE FROM ${tableName} where ${idColumnName} = ?`;

		await this.query(sql, [idValue], startTransaction);

		if (startTransaction && !transactionExists && !startNewTransaction) {
			this.currentTransaction = null;
		}

		removalRecords.forEach((removalRecord) => {
			removalRecord.array.splice(removalRecord.index, 1);
		});
	}

	async find < E, IE extends IEntity >(
		entityName: string,
		phQuery: PHQuery < IE >
	): Promise < E[] > {
		return null;
	}

	async  findOne < E, IE  extends IEntity >(
		entityName: string,
		phQuery: PHQuery < IE >
	): Promise < E > {
		return null;

	}

	async save<E>(
		entityName: string,
		entity: E
	): Promise < E > {
		return null;
	}

	search < E, IE extends IEntity >(
		entityName: string,
		phQuery: PHQuery < IE >,
		subject ?: Subject < E[] >
	): Observable < E[] > {
		return null;
	}

	searchOne < E, IE extends IEntity >(
		entityName: string,
		phQuery: PHQuery < IE >,
		subject ?: Subject < E >
	): Observable < E > {
		return null;
	}

	async update<E>(
		entityName: string,
		entity: E
	): Promise<void> {
		/**
		 * On an update operation, can a nested create contain an update?
		 * Via:
		 *  OneToMany:
		 *    In theory yes, but without a session there is no way to tell
		 *  ManyToOne:
		 *    Cascades do not travel across ManyToOne
		 *
		 *  => Should session be implemented?
		 *  PROS:
		 *    Allows for nested update statements
		 *  CONS:
		 *    Don't have the time(? How much work is it?)
		 *    Makes the mental model more complex
		 * @type {QEntity<any>}
		 */
		let qEntity = PH.qEntityMap[entityName];
		let entityMetadata:EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityRelationMap = PH.entitiesRelationPropertyMap[entityName];

		if (!entityMetadata.idProperty) {
			throw `@Id is not defined for entity: ${entityName}`;
		}

		if (entity[entityMetadata.idProperty]) {
			throw `Cannot create entity: ${entityName}, id is already defined to be: ${entityMetadata.idProperty}`;
		}

		entity[entityMetadata.idProperty] = this.idGenerator.generateId(<any>entityMetadata);

		let columnNames:string[] = [];
		let values:any[] = [];
		let cascadeRecords:CascadeRecord[] = [];
		for (let propertyName in entity) {
			let columnName = PHMetadataUtils.getPropertyColumnName(propertyName, qEntity);
			if (columnName) {
				columnNames.push(columnName);
				values.push(entity[propertyName]);
				continue;
			}
			let nonPropertyValue = entity[propertyName];
			if (!nonPropertyValue) {
				continue;
			}
			// If it's not an object/array, don't process it (must be a transient field)
			if (typeof nonPropertyValue != 'object' || nonPropertyValue instanceof Date) {
				continue;
			}
			columnName = PHMetadataUtils.getJoinColumnName(propertyName, qEntity);
			// if there is no entity data on in, don't process it (transient field)
			if (!columnName) {
				return;
			}
			let entityRelation = entityRelationMap[propertyName];
			switch (entityRelation.relationType) {
				case RelationType.MANY_TO_ONE:
					// get the parent object's id
					let parentObjectIdValue = NameMetadataUtils.getIdValue(entityRelation.entityName, nonPropertyValue);
					if (!parentObjectIdValue) {
						throw `Parent object's (${entityRelation.entityName}) @Id value is missing `;
					}
					columnNames.push(columnName);
					values.push(parentObjectIdValue);
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
									manyEntity: manyEntity
								});
							}
					}
					break;
			}
		}

		let sql = `UPDATE A SET b = ?  WHERE c = ?`;
		return null;
	}

	warn(
		message:string
	) {
		console.log(message);
	}

}