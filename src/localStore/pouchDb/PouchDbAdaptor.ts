import {LocalStoreAdaptor} from "../LocalStoreAdaptor";
import {PouchDbStore, PouchDbStoreSetupInfo, PouchDbStoreShareInfo} from "./PouchDbApi";
import {IQEntity, PHQuery, PouchDbQuery, QEntity, IEntity, RelationType} from "querydsl-typescript/lib/index";
import {EntityUtils} from "../../shared/EntityUtils";
import {DateUtils} from "../../shared/DateUtils";
import {PouchDbRecord} from "./PouchDbModel";
import {Observable} from "rxjs/Observable";
import {PH} from "../../config/PH";
import {Subject} from 'rxjs/Subject';
import {PH_PRIMARY_KEY} from "../../core/metadata/decorators";
import {RelationRecord} from "querydsl-typescript/lib/core/entity/Relation";
import {PlatformUtils} from "../../shared/PlatformUtils";
import {EntityProxy} from "../../core/proxy/Proxies";

declare function require(moduleName:string):any;

const PouchDB = require('pouchdb');
/**
 * Created by Papa on 5/28/2016.
 */

export class PouchDbAdaptor implements LocalStoreAdaptor {

	localDB:pouchDB.IPouchDB;

	async initialize(
		setupInfo:PouchDbStoreSetupInfo
	):Promise<any> {
		let dbName = setupInfo.name;
		var localDB = PouchDB(dbName);

		return await localDB.info().then((
			dbInfo:pouchDB.Response.IInfo
		) => {
			console.log(dbInfo);
		});
	}

	async create<E>(
		entity:E
	):Promise<E> {
		let className = EntityUtils.getObjectClassName(entity);
		let nowTimeStamp = DateUtils.getNowTimeStamp();
		let macAddress = PlatformUtils.getMacAddress();

		let proxy = <EntityProxy><any>entity;
		let record:PouchDbRecord = <any>entity;
		record._id = `${className}_${nowTimeStamp}_${macAddress}`;
		let updateRecord = await this.localDB.put(record);
		record._rev = updateRecord.rev;

		return <any>record;
	}

	async delete<E>(
		entity:E
	):Promise<E> {
		let record:PouchDbRecord = <any>entity;
		let deleteRecord = await this.localDB.remove(record);

		return entity;
	}

	searchOne<E>(
		entityClass:{new ():E},
		phQuery:PHQuery
	):Observable<E> {
		let subject = new Subject<E>();
		this.findOne(entityClass, phQuery).then((
			entity:E
		) => {

		});
		return subject;
	}

	search<E>(
		entityClass:{new ():E},
		phQuery:PHQuery
	):Observable<E[]> {
		let subject = new Subject<E[]>();
		this.find(entityClass, phQuery).then((
			entities:E[]
		) => {
			subject.next(entities);
		});
		return subject;
	}

	async find<E>(
		entityConstructor:{new ():E},
		phQuery:PHQuery
	):Promise<E[]> {
		let jsonQuery = phQuery.toJSON();

		let pouchDbQuery:PouchDbQuery = new PouchDbQuery(phQuery.qEntity.__entityName__, phQuery.entitiesRelationPropertyMap, phQuery.entitiesPropertyTypeMap, jsonQuery);

		return this.processQuery(entityConstructor, pouchDbQuery);
	}

	async processQuery<E>(
		entityConstructor:{new ():E},
		pouchDbQuery:PouchDbQuery
	):Promise<E[]> {
		pouchDbQuery.parse();

		let findResult:pouchDB.Response.IFind = await this.localDB.find(<any>{
			selector: pouchDbQuery.selector,
			fields: pouchDbQuery.fields
		});

		let primaryKey = entityConstructor[PH_PRIMARY_KEY];
		let initialResults:E[] = findResult.docs.map((
			doc:any
		) => {
			let entity = new entityConstructor();
			pouchDbQuery.fields.forEach((
				fieldName:string
			) => {
				entity[fieldName] = doc[fieldName];
			});

			return entity;
		});

		let childQueries = pouchDbQuery.childQueries;

		if (Object.keys(childQueries).length === 0) {
			return initialResults;
		}

		let entityName = EntityUtils.getClassName(entityConstructor);

		for (let propertyName in childQueries) {
			let childQuery:PouchDbQuery = childQueries[propertyName];
			let objectSelector = childQuery.selector['$and'];
			let relationRecord:RelationRecord = PH.entitiesRelationPropertyMap[entityName][propertyName];
			let childEntityConstructor = PH.qEntityMap[relationRecord.entityName].__entityConstructor__;
			switch (relationRecord.relationType) {
				case RelationType.MANY_TO_ONE:
					this.loadOneToManyRelation(childQuery, entityName, initialResults, propertyName);
					break;
				case RelationType.ONE_TO_MANY:
					this.loadOneToManyRelation(childQuery, entityName, initialResults, propertyName);
					break;
			}
		}

		return null;
	}

	async loadManyToOneRelation(
		childQuery,
		entityName:string,
		parentResults,
		propertyName:string
	):Promise<any[]> {
		let objectSelector = childQuery.selector['$and'];
		let relationRecord:RelationRecord = PH.entitiesRelationPropertyMap[entityName][propertyName];
		let childEntityConstructor = PH.qEntityMap[relationRecord.entityName].__entityConstructor__;

		let parentEntitiesByForeignKey:{[foreignKey:string]:any[]} = {};
		let foreignKeys = parentResults.map((
			entity
		) => {
			let foreignKeyValue = entity[relationRecord.propertyName];
			let parentEntitiesForForeignKey:any[] = parentEntitiesByForeignKey[foreignKeyValue];
			if (!parentEntitiesForForeignKey) {
				parentEntitiesForForeignKey = [];
				parentEntitiesByForeignKey[foreignKeyValue] = parentEntitiesForForeignKey;
			}
			parentEntitiesForForeignKey.push(entity);
			return foreignKeyValue;
		});
		objectSelector['_id'] = {
			'$in': foreignKeys
		};
		let oneChildEntities = await this.processQuery(childEntityConstructor, childQuery);

		oneChildEntities.forEach((
			childEntity:any
		) => {
			let oneChildKey = childEntity._id;
			let parentEntitiesForForeignKey:any[] = parentEntitiesByForeignKey[oneChildKey];
			parentEntitiesForForeignKey.forEach((
				parentEntity
			) => {
				parentEntity[propertyName] = childEntity;
			})
		});

		return oneChildEntities;
	}


	async loadOneToManyRelation(
		childQuery,
		entityName:string,
		parentResults,
		propertyName:string
	):Promise<any[]> {
		let objectSelector = childQuery.selector['$and'];
		let relationRecord:RelationRecord = PH.entitiesRelationPropertyMap[entityName][propertyName];
		let childEntityConstructor = PH.qEntityMap[relationRecord.entityName].__entityConstructor__;
		let mappedByPropertyName = relationRecord.mappedBy;
		let parentEntitiesByPrimaryKey:{[foreignKey:string]:any} = {};

		let ids = parentResults.map((
			entity
		) => {
			let primaryKey = entity._id;
			parentEntitiesByPrimaryKey[primaryKey] = entity;
			entity[propertyName] = [];

			return entity._id;
		});

		objectSelector[mappedByPropertyName] = {
			'$in': ids
		};

		let manyChildEntities = await this.processQuery(childEntityConstructor, childQuery);

		manyChildEntities.forEach((
			childEntity:any
		) => {
			let manyChildForeignKey = childEntity[mappedByPropertyName];
			let oneChildKey = childEntity._id;
			let parentEntity = parentEntitiesByPrimaryKey[manyChildForeignKey];
			parentEntity[propertyName].push(childEntity);
		});

		return manyChildEntities;
	}

	async findOne<E>(
		entityClass:{new ():E},
		phQuery:PHQuery
	):Promise<E> {
		let resultList = await this.find(entityClass, phQuery);

		if (resultList.length > 1) {
			throw `Found more than 1 entity for query (${resultList.length}).`;
		}

		if (resultList.length === 1) {
			return resultList[0];
		}

		return null;
	}

	async save<E>(
		entity:E
	):Promise<E> {
		let record:PouchDbRecord = <any>entity;
		if (record._id && record._rev) {
			return await this.update(entity);
		} else {
			return await this.create(entity);
		}
	}

	async update<E>(
		entity:E
	):Promise<E> {
		let record:PouchDbRecord = <any>entity;
		record.lastUpdateTime = new Date();
		let updateRecord = await this.localDB.put(record);
		record._rev = updateRecord.rev;

		return <any>record;
	}

}