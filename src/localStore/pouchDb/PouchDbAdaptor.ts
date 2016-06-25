import {LocalStoreAdaptor} from "../LocalStoreAdaptor";
import {PouchDbStore, PouchDbStoreSetupInfo, PouchDbStoreShareInfo} from "./PouchDbApi";
import {IQEntity, PHQuery, PouchDbQuery, QEntity} from "querydsl-typescript/lib/index";
import {EntityUtils} from "../../shared/EntityUtils";
import {DateUtils} from "../../shared/DateUtils";
import {PouchDbRecord} from "./PouchDbModel";
import {Observable} from "rxjs/Observable";

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

		let record:PouchDbRecord = <any>entity;
		record._id = `${className}_${nowTimeStamp}`;
		let updateRecord = await this.localDB.put(record);
		record._rev = updateRecord.rev;

		return <any>record;
	}

	async delete<E>(
		entity:E
	):Promise<E>
	{
		let record:PouchDbRecord = <any>entity;
		let deleteRecord = await this.localDB.remove(record);

		return entity;
	}

	query<E, IQE extends IQEntity>(
		iQEntity:IQE, qEntity:QEntity<any>
	):Observable<E> {
		let qEntityMap:{[entityName:string]:QEntity<any>} = {};
		let entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:string}} = {};
		let entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}} = {};
		let phQuery:PHQuery = new PHQuery(iQEntity, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
		let jsonQuery = phQuery.toJSON();

		let pouchDbQuery:PouchDbQuery = new PouchDbQuery(qEntity.__entityName__, entitiesRelationPropertyMap, entitiesPropertyTypeMap, jsonQuery);
		pouchDbQuery.parse();

		this.localDB.find(<any>{
			selector: pouchDbQuery.selector,
			fields: pouchDbQuery.fields
		});

		return null;
	}

	async queryOnce<E, IQE extends IQEntity>(
		iQEntity:IQE, qEntity:QEntity<any>
	):Promise<E> {
		return null;
	}

	async save<E>(
		entity:E
	):Promise<E> {
		let record:PouchDbRecord = <any>entity;
		if(record._id && record._rev) {
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