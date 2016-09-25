import {LocalStoreType} from "./LocalStoreApi";
import {PouchDbAdaptor} from "./pouchDb/PouchDbAdaptor";
import {ILocalStoreAdaptor} from "./LocalStoreAdaptor";
import {WebSqlAdaptor} from "./webSql/WebSqlAdaptor";
import {IdGeneration} from "./IdGenerator";
import {IEntityManager} from "../core/repository/EntityManager";
/**
 * Created by Papa on 5/28/2016.
 */

var SQLITE_ADAPTOR;
export function getLocalStoreAdaptor(
	localStoreType:LocalStoreType,
	entityManager:IEntityManager,
	idGeneration:IdGeneration
):ILocalStoreAdaptor {
	switch (localStoreType) {
		case LocalStoreType.POUCH_DB:
			throw `PouchDb is not curently supported`;
		case LocalStoreType.SQLITE_CORDOVA:
			if (!SQLITE_ADAPTOR) {
				SQLITE_ADAPTOR = getSQLiteAdaptor(entityManager, idGeneration);
			}
			return SQLITE_ADAPTOR;
		default:
			throw `Unsupported LocalStoreType: ${localStoreType}`;
	}
}

export function getSQLiteAdaptor(
	entityManager:IEntityManager,
	idGeneration:IdGeneration
):ILocalStoreAdaptor {
	return new WebSqlAdaptor(entityManager, idGeneration);
}