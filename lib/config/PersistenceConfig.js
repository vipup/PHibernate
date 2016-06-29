/**
 * Created by Papa on 5/28/2016.
 */
"use strict";
const EntityConfig_1 = require("./EntityConfig");
const LocalStoreConfig_1 = require("./LocalStoreConfig");
const ChangeListConfig_1 = require("./ChangeListConfig");
const DeltaStoreConfig_1 = require("./DeltaStoreConfig");
const index_1 = require("delta-store/lib/index");
const LocalStoreApi_1 = require("../localStore/LocalStoreApi");
const EntityUtils_1 = require("../shared/EntityUtils");
class PersistenceConfig {
    constructor(config) {
        this.config = config;
        this.changeListConfigMap = {};
        this.deltaStoreConfigMap = {};
        this.entityConfigMap = {};
        this.localStoreConfigMap = {};
        this.hasDeltaStores = false;
        if (config.deltaStores) {
            for (let deltaStoreName in config.deltaStores) {
                let phDeltaStoreConfig = config.deltaStores[deltaStoreName];
                let deltaStoreConfig = DeltaStoreConfig_1.createDeltaStoreConfig(deltaStoreName, phDeltaStoreConfig);
                this.deltaStoreConfigMap[deltaStoreName] = deltaStoreConfig;
                this.hasDeltaStores = true;
            }
        }
        this.hasChangeLists = false;
        let defaultPhChangeListConfig;
        let defaultPhEntityConfig;
        if (config.default) {
            defaultPhChangeListConfig = config.default.changeList;
            defaultPhEntityConfig = config.default.entity;
            this.cascadeRule = config.default.cascadeRule;
        }
        if (config.changeLists) {
            for (let changeListName in config.changeLists) {
                let phChangeListConfig = config.changeLists[changeListName];
                let changeListConfig = new ChangeListConfig_1.ChangeListConfig(changeListName, phChangeListConfig, defaultPhChangeListConfig, this.deltaStoreConfigMap);
                let deltaStoreConfig = this.deltaStoreConfigMap[changeListConfig.deltaStoreName];
                deltaStoreConfig.changeListConfigMap[changeListName] = changeListConfig;
                this.changeListConfigMap[changeListName] = changeListConfig;
                this.hasChangeLists = true;
            }
            if (this.hasChangeLists) {
                if (!config.offlineDeltaStore) {
                    throw `OfflineDeltaStore must be specified if changeLists are specified.`;
                }
                if (!this.hasDeltaStores) {
                    throw `Delta stores must be specified if changeLists are specified`;
                }
            }
            this.offlineDeltaStore = new ChangeListConfig_1.OfflineDeltaStoreConfig(config.offlineDeltaStore, this.deltaStoreConfigMap);
        }
        this.hasLocalStores = false;
        if (config.localStores) {
            for (let localStoreName in config.localStores) {
                let phLocalStoreConfig = config.localStores[localStoreName];
                let localStoreConfig = LocalStoreConfig_1.createLocalStoreConfig(localStoreName, phLocalStoreConfig);
                this.localStoreConfigMap[localStoreName] = localStoreConfig;
                this.hasLocalStores = true;
            }
        }
        if (defaultPhEntityConfig) {
            let changeListName = defaultPhEntityConfig.changeList;
            if (changeListName) {
                let defaultChangeList = this.config.changeLists[changeListName];
                if (!defaultChangeList) {
                    throw `Unknown default Change List: ${changeListName}`;
                }
            }
            let localStoreName = defaultPhEntityConfig.localStore;
            if (localStoreName) {
                let defaultLocalStore = this.localStoreConfigMap[localStoreName];
                if (!defaultLocalStore) {
                    throw `Unknown default Local Store: ${localStoreName}`;
                }
            }
        }
    }
    static getDefaultPHConfig(appName = 'DefaultApp', distributionStrategy = index_1.DistributionStrategy.S3_SECURE_POLL, deltaStorePlatform = index_1.PlatformType.GOOGLE, localStoreType = LocalStoreApi_1.LocalStoreType.POUCH_DB, offlineDeltaStoreType = LocalStoreApi_1.LocalStoreType.POUCH_DB) {
        return {
            appName: appName,
            changeLists: {
                "DefaultChangeList": {}
            },
            default: {
                changeList: {
                    distributionStrategy: distributionStrategy,
                    deltaStore: "DefaultDeltaStore"
                },
                entity: {
                    changeList: "DefaultChangeList",
                    localStore: "DefaultLocalStore"
                }
            },
            deltaStores: {
                "DefaultDeltaStore": {
                    platform: deltaStorePlatform
                }
            },
            localStores: {
                "DefaultLocalStore": {
                    type: localStoreType
                }
            },
            offlineDeltaStore: {
                type: offlineDeltaStoreType
            }
        };
    }
    getEntityConfig(entity) {
        let className = EntityUtils_1.EntityUtils.getObjectClassName(entity);
        let constructor = entity.constructor;
        return this.getEntityConfigWithClassNameAndConstructor(className, constructor);
    }
    getEntityConfigFromQ(qEntity) {
        let constructor = qEntity.__entityConstructor__;
        let className = EntityUtils_1.EntityUtils.getClassName(constructor);
        return this.getEntityConfigWithClassNameAndConstructor(className, constructor);
    }
    getEntityConfigWithClassNameAndConstructor(className, constructor) {
        let entityConfig = this.entityConfigMap[className];
        if (!entityConfig) {
            let phEntityConfig = this.config.entities[className];
            if (!phEntityConfig) {
                phEntityConfig = {};
            }
            let entityDefault = this.config.default.entity;
            if (entityDefault) {
                if (!phEntityConfig.changeList) {
                    phEntityConfig.changeList = entityDefault.changeList;
                }
                if (!phEntityConfig.localStore) {
                    phEntityConfig.localStore = entityDefault.localStore;
                }
            }
            entityConfig = new EntityConfig_1.EntityConfig(className, constructor, phEntityConfig, this);
            this.entityConfigMap[className] = entityConfig;
        }
        return entityConfig;
    }
}
exports.PersistenceConfig = PersistenceConfig;
//# sourceMappingURL=PersistenceConfig.js.map