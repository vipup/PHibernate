/**
 * Created by Papa on 5/28/2016.
 */
"use strict";
const LocalStoreConfig_1 = require("./LocalStoreConfig");
const DeltaStoreConfig_1 = require("./DeltaStoreConfig");
const index_1 = require("delta-store/lib/index");
const LocalStoreApi_1 = require("../localStore/LocalStoreApi");
const IdGenerator_1 = require("../localStore/IdGenerator");
class PersistenceConfig {
    constructor(config) {
        this.config = config;
        if (config.deltaStore) {
            let phDeltaStoreConfig = config.deltaStore;
            this.deltaStoreConfig = DeltaStoreConfig_1.createDeltaStoreConfig(phDeltaStoreConfig);
        }
        if (config.localStore) {
            this.localStoreConfig = LocalStoreConfig_1.createLocalStoreConfig(config.appName, config.localStore);
        }
    }
    static getDefaultPHConfig(appName = 'DefaultApp', distributionStrategy = index_1.DistributionStrategy.S3_SECURE_POLL, deltaStorePlatform = index_1.PlatformType.GOOGLE, localStoreType = LocalStoreApi_1.LocalStoreType.SQLITE_CORDOVA, offlineDeltaStoreType = LocalStoreApi_1.LocalStoreType.SQLITE_CORDOVA, idGeneration = IdGenerator_1.IdGeneration.ENTITY_CHANGE_ID) {
        return {
            appName: appName,
            deltaStore: {
                changeList: {
                    distributionStrategy: distributionStrategy
                },
                offlineDeltaStore: {
                    type: offlineDeltaStoreType
                },
                recordIdField: "id",
                platform: deltaStorePlatform
            },
            localStore: {
                type: localStoreType,
                idGeneration: idGeneration
            }
        };
    }
}
exports.PersistenceConfig = PersistenceConfig;
//# sourceMappingURL=PersistenceConfig.js.map