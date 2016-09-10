"use strict";
(function (LocalStoreType) {
    LocalStoreType[LocalStoreType["POUCH_DB"] = 0] = "POUCH_DB";
    LocalStoreType[LocalStoreType["SQLITE_CORDOVA"] = 1] = "SQLITE_CORDOVA";
})(exports.LocalStoreType || (exports.LocalStoreType = {}));
var LocalStoreType = exports.LocalStoreType;
var localStore;
(function (localStore) {
    var type;
    (function (type) {
        type.POUCH_DB = 'POUCH_DB';
        type.WEB_SQL = 'WEB_SQL';
        function getName(localStoreType) {
            switch (localStoreType) {
                case LocalStoreType.SQLITE_CORDOVA:
                    return type.WEB_SQL;
                case LocalStoreType.POUCH_DB:
                    throw `PouchDb is not currently supported`;
                default:
                    throw `Unsupported Local Store Type: ${localStoreType}`;
            }
        }
        type.getName = getName;
        function getValue(localStoreTypeName) {
            switch (localStoreTypeName) {
                case type.WEB_SQL:
                    return LocalStoreType.SQLITE_CORDOVA;
                case type.POUCH_DB:
                    throw `PouchDb is not currently supported`;
                default:
                    throw `Unsupported Local Store Type name: ${localStoreTypeName}`;
            }
        }
        type.getValue = getValue;
    })(type = localStore.type || (localStore.type = {}));
})(localStore = exports.localStore || (exports.localStore = {}));
//# sourceMappingURL=LocalStoreApi.js.map