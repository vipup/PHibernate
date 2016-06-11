import {LocalStoreAdaptor} from "../LocalStoreAdaptor";
import {PouchDbStore, PouchDbStoreSetupInfo, PouchDbStoreShareInfo} from "./PouchDbApi";
import {IQEntity} from "querydsl-typescript/lib/index";

declare function require(moduleName:string):any;

var PouchDB = require('pouchdb');
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
		return null;
	}

	async delete<E>(
		entity:E
	):Promise<E> {
		return null;
	}

	async query<E, IQE extends IQEntity<IQE>>(
		qEntity:IQE
	):Promise<E> {
		return null;
	}

	async persist<E>(
		entity:E
	):Promise<E> {
		return null;
	}

	async update<E>(
		entity:E
	):Promise<E> {
		return null;
	}

}