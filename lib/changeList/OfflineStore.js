"use strict";
const OfflinePouchDbSharingAdaptor_1 = require("./offline/pouchDb/OfflinePouchDbSharingAdaptor");
const LocalStoreApi_1 = require("../localStore/LocalStoreApi");
/**
 * Created by Papa on 5/31/2016.
 */
var OFFLINE_POUCHDB_SHARING_ADAPTOR;
function getOfflineSharingAdaptor(localStoreType) {
    switch (localStoreType) {
        case LocalStoreApi_1.LocalStoreType.POUCH_DB:
            if (!OFFLINE_POUCHDB_SHARING_ADAPTOR) {
                OFFLINE_POUCHDB_SHARING_ADAPTOR = getOfflinePouchdbSharingAdaptor();
            }
            return OFFLINE_POUCHDB_SHARING_ADAPTOR;
        default:
            throw `Unsupported LocalStoreType: ${localStoreType}`;
    }
}
exports.getOfflineSharingAdaptor = getOfflineSharingAdaptor;
function getOfflinePouchdbSharingAdaptor() {
    return new OfflinePouchDbSharingAdaptor_1.OfflinePouchDbSharingAdaptor();
}
exports.getOfflinePouchdbSharingAdaptor = getOfflinePouchdbSharingAdaptor;
//# sourceMappingURL=OfflineStore.js.map