import {LocalStoreType} from "./LocalStoreApi";
import {PouchDbAdaptor} from "./pouchDb/PouchDbAdaptor";
import {LocalStoreAdaptor} from "./LocalStoreAdaptor";
/**
 * Created by Papa on 5/28/2016.
 */

var POUCHDB_ADAPTOR;
export function getLocalStoreAdaptor(
	localStoreType:LocalStoreType
):LocalStoreAdaptor {
	switch (localStoreType) {
		case LocalStoreType.POUCH_DB:
			if (!POUCHDB_ADAPTOR) {
				POUCHDB_ADAPTOR = getPouchDbAdaptor();
			}
			return POUCHDB_ADAPTOR;
		default:
			throw `Unsupported LocalStoreType: ${localStoreType}`;
	}
}

export function getPouchDbAdaptor():LocalStoreAdaptor {
	return new PouchDbAdaptor();
}