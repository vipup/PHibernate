"use strict";
const delta_store_1 = require("delta-store");
class ChangeListConfig {
    constructor(changeListName, config, defaultConfig, deltaStoreConfigMap) {
        this.changeListName = changeListName;
        this.config = config;
        this.defaultConfig = defaultConfig;
        let deltaStoreName = config.deltaStore;
        if (!deltaStoreName) {
            deltaStoreName = defaultConfig.deltaStore;
        }
        if (!deltaStoreName) {
            throw `'changeLists.${changeListName}.deltaStore' is not specified.`;
        }
        let deltaStoreConfig = deltaStoreConfigMap[deltaStoreName];
        if (!deltaStoreConfig) {
            throw `Could not find configuration for 'deltaStore': ${deltaStoreName}`;
        }
        this.deltaStoreName = deltaStoreName;
        this.deltaStoreConfig = deltaStoreConfig;
        let distributionStrategy = config.distributionStrategy;
        if (!distributionStrategy) {
            distributionStrategy = defaultConfig.distributionStrategy;
        }
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
            name: changeListName
        };
    }
}
exports.ChangeListConfig = ChangeListConfig;
class OfflineDeltaStoreConfig {
    constructor(storeConfig, config, deltaStoreConfigMap) {
        this.storeConfig = storeConfig;
        this.config = config;
        this.changeListConfigMap = {};
        for (let deltaStoreName in deltaStoreConfigMap) {
            let deltaStoreConfig = deltaStoreConfigMap[deltaStoreName];
            for (let changeListName in deltaStoreConfig.changeListConfigMap) {
                let changeListConfig = deltaStoreConfig.changeListConfigMap[changeListName];
                let offlineChangeListName = this.getOfflineChangeListName(deltaStoreName, changeListName);
                this.changeListConfigMap[offlineChangeListName] = {
                    changeListInfo: changeListConfig.changeListInfo,
                    deltaStoreConfig: this,
                    deltaStoreName: OfflineDeltaStoreConfig.OFFLINE_DELTA_STORE_NAME,
                    distributionStrategy: changeListConfig.distributionStrategy
                };
            }
        }
        this.type = config.type;
        this.setupInfo = {
            changeTimeField: this.storeConfig.changeTimeField,
            changeTypeField: this.storeConfig.changeTypeField,
            changeUserField: this.storeConfig.changeUserField,
            platformType: delta_store_1.PlatformType.OFFLINE,
            recordIdField: this.storeConfig.recordIdField
        };
    }
    getOfflineChangeListName(deltaStoreName, changeListName) {
        return `${deltaStoreName}:${changeListName}`;
    }
}
OfflineDeltaStoreConfig.OFFLINE_DELTA_STORE_NAME = 'Offline';
exports.OfflineDeltaStoreConfig = OfflineDeltaStoreConfig;
//# sourceMappingURL=ChangeListConfig.js.map