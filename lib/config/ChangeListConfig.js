"use strict";
const delta_store_1 = require("delta-store");
class ChangeListConfig {
    constructor(config, deltaStoreConfig) {
        this.config = config;
        this.deltaStoreConfig = deltaStoreConfig;
        this.deltaStoreConfig = deltaStoreConfig;
        let distributionStrategy = config.distributionStrategy;
        if (!distributionStrategy) {
            throw `Distribution Strategy is not defined`;
        }
        if (typeof distributionStrategy === "string") {
            this.distributionStrategy = delta_store_1.deltaStore.distributionStrategy.getValue(distributionStrategy);
        }
        else {
            // Verify the distributionStrategy
            delta_store_1.deltaStore.distributionStrategy.getName(config.distributionStrategy);
            this.distributionStrategy = config.distributionStrategy;
        }
        this.changeListInfo = {
            name: 'ChangeGroups'
        };
    }
}
exports.ChangeListConfig = ChangeListConfig;
//# sourceMappingURL=ChangeListConfig.js.map