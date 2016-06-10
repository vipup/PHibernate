/**
 * Created by Papa on 5/28/2016.
 */

export interface LocalStoreShareInfo {
	name:string;
}

export interface LocalStoreSetupInfo {
	name:string;
	type:LocalStoreType;
}

export enum LocalStoreType {
	POUCH_DB
}

export namespace localStore.type {
	export const POUCH_DB = 'POUCH_DB';

	export function getName(
		localStoreType:LocalStoreType
	):string {
		switch(localStoreType) {
			case LocalStoreType.POUCH_DB:
				return POUCH_DB;
			default:
				throw `Unsupported Local Store Type: ${localStoreType}`;
		}
	}

	export function getValue(
		localStoreTypeName:string
	):LocalStoreType {
		switch (localStoreTypeName) {
			case POUCH_DB:
				return LocalStoreType.POUCH_DB;
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