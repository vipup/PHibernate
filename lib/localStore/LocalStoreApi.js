/**
 * Created by Papa on 5/28/2016.
 */
"use strict";
(function (LocalStoreType) {
    LocalStoreType[LocalStoreType["POUCH_DB"] = 0] = "POUCH_DB";
})(exports.LocalStoreType || (exports.LocalStoreType = {}));
var LocalStoreType = exports.LocalStoreType;
var localStore;
(function (localStore) {
    var type;
    (function (type) {
        type.POUCH_DB = 'POUCH_DB';
        function getName(localStoreType) {
            switch (localStoreType) {
                case LocalStoreType.POUCH_DB:
                    return type.POUCH_DB;
                default:
                    throw `Unsupported Local Store Type: ${localStoreType}`;
            }
        }
        type.getName = getName;
        function getValue(localStoreTypeName) {
            switch (localStoreTypeName) {
                case type.POUCH_DB:
                    return LocalStoreType.POUCH_DB;
                default:
                    throw `Unsupported Local Store Type name: ${localStoreTypeName}`;
            }
        }
        type.getValue = getValue;
    })(type = localStore.type || (localStore.type = {}));
})(localStore = exports.localStore || (exports.localStore = {}));
//# sourceMappingURL=LocalStoreApi.js.map