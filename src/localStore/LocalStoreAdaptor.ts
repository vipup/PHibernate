import {LocalStore, LocalStoreSetupInfo, LocalStoreShareInfo} from "./LocalStoreApi";
/**
 * Created by Papa on 5/28/2016.
 */

export interface LocalStoreAdaptor {

	initialize(
		setupInfo:LocalStoreSetupInfo
	):Promise<any>;

	findExistingStores(
		setupInfo:LocalStoreSetupInfo
	):Promise<LocalStoreShareInfo[]>;

	createStore(
		name:string,
		setupInfo:LocalStoreSetupInfo
	):Promise<LocalStore>;

	loadStore(
		shareInfo:LocalStoreShareInfo
	):Promise<LocalStore>;

}