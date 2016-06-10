import {LocalStore, LocalStoreShareInfo, LocalStoreSetupInfo, LocalStoreType} from "../LocalStoreApi";
/**
 * Created by Papa on 5/28/2016.
 */

export class PouchDbStoreShareInfo implements LocalStoreShareInfo {
	name:string;
}

export class PouchDbStoreSetupInfo implements LocalStoreSetupInfo {
	name:string;
	type:LocalStoreType;
}

export class PouchDbStore implements LocalStore {

	insert(
		entity:any
	):Promise<any> {
		return null;
	}

	delete(
		entity:any
	):Promise<any> {
		return null;
	}

	update(
		entity:any
	):Promise<any> {
		return null;
	}

	query(
		query:any
	):Promise<any> {
		return null;
	}

}