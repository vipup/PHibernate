import {SharingAdaptor} from "delta-store";
import {OfflinePouchDbSharingAdaptor} from "./offline/sql/OfflineSqlSharingAdaptor";
import {LocalStoreType} from "../localStore/LocalStoreApi";
/**
 * Created by Papa on 5/31/2016.
 */

var OFFLINE_POUCHDB_SHARING_ADAPTOR;

export function getOfflineSharingAdaptor (
	localStoreType:LocalStoreType
):SharingAdaptor {
	switch (localStoreType) {
		case LocalStoreType.POUCH_DB:
			if (!OFFLINE_POUCHDB_SHARING_ADAPTOR) {
				OFFLINE_POUCHDB_SHARING_ADAPTOR = getOfflinePouchdbSharingAdaptor();
			}
			return OFFLINE_POUCHDB_SHARING_ADAPTOR;
		default:
			throw `Unsupported LocalStoreType: ${localStoreType}`;
	}
}

export function getOfflinePouchdbSharingAdaptor():SharingAdaptor {
	return new OfflinePouchDbSharingAdaptor();
}