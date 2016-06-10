import {LocalStoreAdaptor} from "../LocalStoreAdaptor";
import {PouchDbStore, PouchDbStoreSetupInfo, PouchDbStoreShareInfo} from "./PouchDbApi";
/**
 * Created by Papa on 5/28/2016.
 */

export class PouchDbAdaptor implements LocalStoreAdaptor {


	initialize(
		setupInfo:PouchDbStoreSetupInfo
	):Promise<any> {
		return null;
	}

	findExistingStores(
		setupInfo:PouchDbStoreSetupInfo
	):Promise<PouchDbStoreShareInfo[]> {
		return null;
	}

	createStore(
		name:string,
		setupInfo:PouchDbStoreSetupInfo
	):Promise<PouchDbStore> {
		return null;
	}

	loadStore(
		shareInfo:PouchDbStoreShareInfo
	):Promise<PouchDbStore> {
		return null;
	}

}