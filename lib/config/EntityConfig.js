"use strict";
class EntityConfig {
    constructor(className, clazz, config, persistenceConfig //
        ) {
        this.className = className;
        this.clazz = clazz;
        this.config = config;
        this.persistenceConfig = persistenceConfig;
        if (!config) {
            throw `Entity Configuration not specified`;
        }
        let changeListName = config.changeList;
        if (changeListName) {
            let changeListConfig = persistenceConfig.changeListConfigMap[changeListName];
            if (!changeListConfig) {
                throw `Unknown Change List: ${changeListName} for Entity ${className}`;
            }
            this.changeListConfig = changeListConfig;
        }
        let localStoreName = config.localStore;
        if (localStoreName) {
            let localStoreConfig = persistenceConfig.localStoreConfigMap[localStoreName];
            if (!localStoreConfig) {
                throw `Unknown Local Store: ${localStoreName} for Entity ${className}`;
            }
            this.localStoreConfig = localStoreConfig;
        }
        if (!this.changeListConfig && !this.localStoreConfig) {
            throw `Entity Configuration does not specify a Change List or a Local Store`;
        }
        if (config.cascadeRule) {
            this.cascadeRule = config.cascadeRule;
        }
        if (!this.cascadeRule && persistenceConfig.cascadeRule) {
            this.cascadeRule = persistenceConfig.cascadeRule;
        }
    }
}
exports.EntityConfig = EntityConfig;
//# sourceMappingURL=EntityConfig.js.map