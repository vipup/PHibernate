"use strict";
const delta_store_1 = require("delta-store");
class OfflineDeltaStoreConfig {
    constructor(config, deltaStoreConfig) {
        this.config = config;
        let changeListConfig = deltaStoreConfig.changeListConfig;
        this.type = config.type;
        this.setupInfo = {
            platformType: delta_store_1.PlatformType.OFFLINE,
            recordIdField: deltaStoreConfig.config.recordIdField
        };
    }
}
exports.OfflineDeltaStoreConfig = OfflineDeltaStoreConfig;
//# sourceMappingURL=OfflineDeltaStoreConfig.js.map