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
    }
    static getObjectClassName(object) {
        if (typeof object != "object" || object === null) {
            throw `Not an object instance`;
        }
        return this.getClassName(object.constructor);
    }
    static getClassName(clazz) {
        if (typeof clazz != "function") {
            throw `Not a constructor function`;
        }
        let className = clazz['name'];
        // let className = /(\w+)\(/.exec(clazz.toString())[1];
        return className;
    }
}
exports.EntityConfig = EntityConfig;
//# sourceMappingURL=EntityConfig.js.map