"use strict";
const LocalStoreApi_1 = require("./LocalStoreApi");
const WebSqlAdaptor_1 = require("./webSql/WebSqlAdaptor");
/**
 * Created by Papa on 5/28/2016.
 */
var SQLITE_ADAPTOR;
function getLocalStoreAdaptor(localStoreType, idGeneration) {
    switch (localStoreType) {
        case LocalStoreApi_1.LocalStoreType.POUCH_DB:
            throw `PouchDb is not curently supported`;
        case LocalStoreApi_1.LocalStoreType.SQLITE_CORDOVA:
            if (!SQLITE_ADAPTOR) {
                SQLITE_ADAPTOR = getSQLiteAdaptor(idGeneration);
            }
            return SQLITE_ADAPTOR;
        default:
            throw `Unsupported LocalStoreType: ${localStoreType}`;
    }
}
exports.getLocalStoreAdaptor = getLocalStoreAdaptor;
function getSQLiteAdaptor(idGeneration) {
    return new WebSqlAdaptor_1.WebSqlAdaptor(idGeneration);
}
exports.getSQLiteAdaptor = getSQLiteAdaptor;
//# sourceMappingURL=LocalStore.js.map