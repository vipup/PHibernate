import {
	IEntity, QEntity, IEntityQuery, IQField, IQRelation,
	RelationRecord, EntityMetadata, JSONBaseOperation, IOperation
} from "querydsl-typescript";
import {EntityUtils} from "../shared/EntityUtils";
import {PHPersistenceConfig, PersistenceConfig} from "./PersistenceConfig";
import {EntityManager} from "../core/repository/EntityManager";
import {QuerySubject, QueryOneSubject} from "../core/query/QuerySubject";
/**
 * Created by Papa on 6/24/2016.
 */

class A {
	b:string;
}

var c:A = {
	b: 'd'
};

console.log(c.b);

export class PH {

	static qEntityMap: {[entityName: string]: QEntity<any>} = {};
	static entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}} = {};
	static entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}} = {};

	static getQEntityFromEntityClass(
		entityClass: any
	): QEntity<any> {
		let entityClassName = EntityUtils.getClassName(entityClass);
		let qEntity = PH.qEntityMap[entityClassName];

		return qEntity;
	}

	static addQEntity(
		entityConstructor: {new (): any},
		qEntity: QEntity<any>
	) {
		let entityName = qEntity.__entityName__;
		let fields = qEntity.__entityFieldMap__;
		let relations = qEntity.__entityRelationMap__;

		PH.qEntityMap[entityName] = qEntity;

		let entityRelationPropertyMap = PH.entitiesRelationPropertyMap[entityName];
		if (entityRelationPropertyMap) {
			entityRelationPropertyMap = {};
			PH.entitiesRelationPropertyMap[entityName] = entityRelationPropertyMap;
		}
		let entityMetadata: EntityMetadata = <EntityMetadata><any>entityConstructor;

		for (let relationPropertyName in relations) {
			let relation: IQRelation<any, any, any> = relations[relationPropertyName];
			let propertyName = relation.propertyName;
			let relationClassName = EntityUtils.getClassName(relation.relationEntityConstructor);

			let relationRecord: RelationRecord = {
				entityName: relationClassName,
				propertyName: propertyName,
				relationType: relation.relationType
			};

			entityRelationPropertyMap[propertyName] = relationRecord;
		}

		let entityPropertyTypeMap = PH.entitiesPropertyTypeMap[entityName];
		if (entityPropertyTypeMap) {
			entityPropertyTypeMap = {};
			PH.entitiesPropertyTypeMap[entityName] = entityPropertyTypeMap;
		}
		for (let fieldPropertyName in fields) {
			let field: IQField<any, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>> = fields[fieldPropertyName];
			entityPropertyTypeMap[field.fieldName] = true;
		}
	}

	static entityManager: EntityManager;

	static init(
		phConfig: PHPersistenceConfig
	) {
		let persistenceConfig = new PersistenceConfig(phConfig);

		PH.entityManager = new EntityManager(persistenceConfig);
	}

	static getFindSubject<E, IE extends IEntity>(
		entityClass: {new (): E}
	): QuerySubject<E, IE> {
		let subscription;
		let querySubject = new QuerySubject<E, IE>(entityClass, () => {
			if (querySubject.resultsSubject.observers.length < 1) {
				subscription.unsubscribe();
			}
		});

		subscription = querySubject.querySubject.subscribe(( //
			iEntityQuery: IEntityQuery<IE> //
		) => {
			PH.entityManager.search(entityClass, iEntityQuery, querySubject.resultsSubject);
		});


		return querySubject;
	}

	static getFindOneSubject<E, IE extends IEntity>(
		entityClass: {new (): E}
	): QueryOneSubject<E, IE> {
		let subscription;
		let querySubject = new QueryOneSubject<E, IE>(entityClass, () => {
			if (querySubject.resultsSubject.observers.length < 1) {
				subscription.unsubscribe();
			}
		});

		subscription = querySubject.querySubject.subscribe(( //
			iEntityQuery: IEntityQuery<IE> //
		) => {
			PH.entityManager.searchOne(entityClass, iEntityQuery, querySubject.resultsSubject);
		});


		return querySubject;
	}

}