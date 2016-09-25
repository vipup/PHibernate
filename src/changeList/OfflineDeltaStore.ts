import {IDeltaStore} from "./DeltaStore";
import {SharingAdaptor} from "delta-store";
import {LocalStoreType} from "../localStore/LocalStoreApi";
import {ILocalStoreAdaptor} from "../localStore/LocalStoreAdaptor";
import {OfflineSqlDeltaStore} from "./offline/sql/OfflineSqlDeltaStore";
import {IOfflineDeltaStoreConfig} from "../config/OfflineDeltaStoreConfig";
import {IEntityChange} from "./model/EntityChange";
import {IChangeGroup} from "./model/ChangeGroup";
import {IChangeListConfig} from "../config/ChangeListConfig";
/**
 * Created by Papa on 5/31/2016.
 */

export interface IOfflineDeltaStore {

	config:IOfflineDeltaStoreConfig;

	addChange(
		changeRecord:IChangeGroup
	):Promise<IChangeGroup>;

	findChangesForEntitiesWithFieldsSinceTime(
		entityChanges:IEntityChange[]
	):Promise<IEntityChange[]>;

	findUnsyncedChanges():Promise<IChangeGroup[]>;

	markChangesAsSynced(changeGroups:IChangeGroup[]):Promise<void>;

}

var OFFLINE_DELTA_STORE:IOfflineDeltaStore;

export function getOfflineDeltaStore(
	localStore: ILocalStoreAdaptor,
	offlineDeltaStoreConfig:IOfflineDeltaStoreConfig
):IOfflineDeltaStore {
	switch (localStore.type) {
		case LocalStoreType.POUCH_DB:
			throw `PouchDB is not supported`;
		/*
		 if (!OFFLINE_POUCHDB_SHARING_ADAPTOR) {
		 OFFLINE_POUCHDB_SHARING_ADAPTOR = getOfflinePouchdbSharingAdaptor();
		 }
		 return OFFLINE_POUCHDB_SHARING_ADAPTOR;
		 */
		case LocalStoreType.SQLITE_CORDOVA:
			if (!OFFLINE_DELTA_STORE) {
				OFFLINE_DELTA_STORE = new OfflineSqlDeltaStore(localStore, offlineDeltaStoreConfig);
			}
			return OFFLINE_DELTA_STORE;
		default:
			throw `Unsupported LocalStoreType: ${localStore.type}`;
	}
}