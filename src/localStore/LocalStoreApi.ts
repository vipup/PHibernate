import {IdGeneration} from "./IdGenerator";
/**
 * Created by Papa on 5/28/2016.
 */

export interface LocalStoreShareInfo {
	name:string;
}

export interface LocalStoreSetupInfo {
	name:string;
	type:LocalStoreType;
	idGeneration:IdGeneration;
}

export enum LocalStoreType {
	POUCH_DB,
	SQLITE_CORDOVA
}

export namespace localStore.type {
	export const POUCH_DB = 'POUCH_DB';
	export const WEB_SQL = 'WEB_SQL';

	export function getName(
		localStoreType:LocalStoreType
	):string {
		switch(localStoreType) {
			case LocalStoreType.SQLITE_CORDOVA:
				return WEB_SQL;
			case LocalStoreType.POUCH_DB:
				throw `PouchDb is not currently supported`;
			default:
				throw `Unsupported Local Store Type: ${localStoreType}`;
		}
	}

	export function getValue(
		localStoreTypeName:string
	):LocalStoreType {
		switch (localStoreTypeName) {
			case WEB_SQL:
				return LocalStoreType.SQLITE_CORDOVA;
			case POUCH_DB:
				throw `PouchDb is not currently supported`;
			default:
				throw `Unsupported Local Store Type name: ${localStoreTypeName}`;
		}
	}

}

export interface LocalStore {

	insert(
		entity:any
	):Promise<any>;

	delete(
		entity:any
	):Promise<any>;

	update(
		entity:any
	):Promise<any>;

	query(
		query:any
	):Promise<any>;

}