import {LocalStoreType} from "./LocalStoreApi";
import {PouchDbAdaptor} from "./pouchDb/PouchDbAdaptor";
import {LocalStoreAdaptor} from "./LocalStoreAdaptor";
import {WebSqlAdaptor} from "./webSql/WebSqlAdaptor";
/**
 * Created by Papa on 5/28/2016.
 */

var SQLITE_ADAPTOR;
export function getLocalStoreAdaptor(
	localStoreType:LocalStoreType
):LocalStoreAdaptor {
	switch (localStoreType) {
		case LocalStoreType.POUCH_DB:
			throw `PouchDb is not curently supported`;
		case LocalStoreType.SQLITE:
			if (!SQLITE_ADAPTOR) {
				SQLITE_ADAPTOR = getSQLiteAdaptor();
			}
			return SQLITE_ADAPTOR;
		default:
			throw `Unsupported LocalStoreType: ${localStoreType}`;
	}
}

export function getSQLiteAdaptor():LocalStoreAdaptor {
	return new WebSqlAdaptor();
}