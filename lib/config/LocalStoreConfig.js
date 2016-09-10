"use strict";
/**
 * Created by Papa on 5/28/2016.
 */
const LocalStoreApi_1 = require("../localStore/LocalStoreApi");
class PouchDbLocalStoreConfig extends CommonLocalStoreConfig {
}
exports.PouchDbLocalStoreConfig = PouchDbLocalStoreConfig;
class SqLiteCordovaLocalStoreConfig extends CommonLocalStoreConfig {
}
exports.SqLiteCordovaLocalStoreConfig = SqLiteCordovaLocalStoreConfig;
class CommonLocalStoreConfig {
    constructor(localStoreName, type, idGeneration) {
        this.setupInfo = {
            name: localStoreName,
            type: type,
            idGeneration: idGeneration
        };
    }
}
exports.CommonLocalStoreConfig = CommonLocalStoreConfig;
function createLocalStoreConfig(localStoreName, config) {
    if (!config.type) {
        throw `Local Store Type is not specified`;
    }
    if (!config.idGeneration) {
        throw `Id Generation startegy is not specified`;
    }
    let type;
    if (typeof config.type === "string") {
        type = LocalStoreApi_1.localStore.type.getValue(config.type);
    }
    else {
        // Verify the type
        LocalStoreApi_1.localStore.type.getName(config.type);
        type = config.type;
    }
    switch (type) {
        case LocalStoreApi_1.LocalStoreType.SQLITE_CORDOVA:
            return new SqLiteCordovaLocalStoreConfig(localStoreName, config.type, config.idGeneration);
        case LocalStoreApi_1.LocalStoreType.POUCH_DB:
            throw `PouchDb is not currently supported`;
        // return new PouchDbLocalStoreConfig(localStoreName, <LocalStoreType>config.type);
        default:
            throw `Unsupported LocalStoreType: ${type}`;
    }
}
exports.createLocalStoreConfig = createLocalStoreConfig;
//# sourceMappingURL=LocalStoreConfig.js.map