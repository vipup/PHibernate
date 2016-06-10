"use strict";
const LocalStoreApi_1 = require("./LocalStoreApi");
const PouchDbAdaptor_1 = require("./pouchDb/PouchDbAdaptor");
/**
 * Created by Papa on 5/28/2016.
 */
var POUCHDB_ADAPTOR;
function getLocalStoreAdaptor(localStoreType) {
    switch (localStoreType) {
        case LocalStoreApi_1.LocalStoreType.POUCH_DB:
            if (!POUCHDB_ADAPTOR) {
                POUCHDB_ADAPTOR = getPouchDbAdaptor();
            }
            return POUCHDB_ADAPTOR;
        default:
            throw `Unsupported LocalStoreType: ${localStoreType}`;
    }
}
exports.getLocalStoreAdaptor = getLocalStoreAdaptor;
function getPouchDbAdaptor() {
    return new PouchDbAdaptor_1.PouchDbAdaptor();
}
exports.getPouchDbAdaptor = getPouchDbAdaptor;
//# sourceMappingURL=LocalStore.js.map