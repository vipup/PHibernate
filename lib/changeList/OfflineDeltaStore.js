"use strict";
const LocalStoreApi_1 = require("../localStore/LocalStoreApi");
const OfflineSqlDeltaStore_1 = require("./offline/sql/OfflineSqlDeltaStore");
var OFFLINE_DELTA_STORE;
function getOfflineDeltaStore(localStore, offlineDeltaStoreConfig) {
    switch (localStore.type) {
        case LocalStoreApi_1.LocalStoreType.POUCH_DB:
            throw `PouchDB is not supported`;
        /*
         if (!OFFLINE_POUCHDB_SHARING_ADAPTOR) {
         OFFLINE_POUCHDB_SHARING_ADAPTOR = getOfflinePouchdbSharingAdaptor();
         }
         return OFFLINE_POUCHDB_SHARING_ADAPTOR;
         */
        case LocalStoreApi_1.LocalStoreType.SQLITE_CORDOVA:
            if (!OFFLINE_DELTA_STORE) {
                OFFLINE_DELTA_STORE = new OfflineSqlDeltaStore_1.OfflineSqlDeltaStore(localStore, offlineDeltaStoreConfig);
            }
            return OFFLINE_DELTA_STORE;
        default:
            throw `Unsupported LocalStoreType: ${localStore.type}`;
    }
}
exports.getOfflineDeltaStore = getOfflineDeltaStore;
//# sourceMappingURL=OfflineDeltaStore.js.map