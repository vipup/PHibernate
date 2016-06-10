"use strict";
/**
 * Created by Papa on 5/28/2016.
 */
const LocalStoreApi_1 = require("../localStore/LocalStoreApi");
class PouchDbLocalStoreConfig {
    constructor(localStoreName, type) {
        this.setupInfo = {
            name: localStoreName,
            type: type
        };
    }
}
exports.PouchDbLocalStoreConfig = PouchDbLocalStoreConfig;
function createLocalStoreConfig(localStoreName, config) {
    if (!config.type) {
        throw `Local Store Type is not specified`;
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
        case LocalStoreApi_1.LocalStoreType.POUCH_DB:
            return new PouchDbLocalStoreConfig(localStoreName, config.type);
        default:
            throw `Unsupported LocalStoreType: ${type}`;
    }
}
exports.createLocalStoreConfig = createLocalStoreConfig;
//# sourceMappingURL=LocalStoreConfig.js.map