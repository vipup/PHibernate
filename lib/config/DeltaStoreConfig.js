/**
 * Created by Papa on 5/31/2016.
 */
"use strict";
const delta_store_1 = require("delta-store");
const ChangeListConfig_1 = require("./ChangeListConfig");
const OfflineDeltaStoreConfig_1 = require("./OfflineDeltaStoreConfig");
class DeltaStoreConfig {
    constructor(config) {
        this.config = config;
        if (!config.platform) {
            throw `Sharing Platform is not defined`;
        }
        let platformType = getPlatformType(config.platform);
        this.setupInfo = {
            recordIdField: config.recordIdField,
            platformType: platformType
        };
        if (config.changeList) {
            throw `ChangeList config is not defined`;
        }
        if (!config.offlineDeltaStore) {
            throw `OfflineDeltaStore must be specified if changeLists are specified.`;
        }
        this.changeListConfig = new ChangeListConfig_1.ChangeListConfig(config.changeList, this);
        this.offlineDeltaStore = new OfflineDeltaStoreConfig_1.OfflineDeltaStoreConfig(config.offlineDeltaStore, this);
    }
}
exports.DeltaStoreConfig = DeltaStoreConfig;
function getPlatformType(platform) {
    let platformType;
    if (typeof platform === "string") {
        platformType = delta_store_1.deltaStore.platform.getValue(platform);
    }
    else {
        // Verify the platform
        delta_store_1.deltaStore.platform.getName(platform);
        platformType = platform;
    }
    return platformType;
}
exports.getPlatformType = getPlatformType;
class GoogleDeltaStoreConfig extends DeltaStoreConfig {
    constructor(config) {
        super(config);
        if (!config.rootFolder) {
            throw `Root folder is not defined`;
        }
        if (!config.apiKey) {
            throw `ApiKey is not defined`;
        }
        if (!config.clientId) {
            throw `ClientId is not defined`;
        }
        this.setupInfo.rootFolder = config.rootFolder;
        this.setupInfo.apiKey = config.apiKey;
        this.setupInfo.clientId = config.clientId;
    }
}
exports.GoogleDeltaStoreConfig = GoogleDeltaStoreConfig;
function createDeltaStoreConfig(phDeltaStoreConfig) {
    if (!phDeltaStoreConfig.platform) {
        throw `deltaStore.platform is nod specified`;
    }
    let platformType = getPlatformType(phDeltaStoreConfig.platform);
    switch (platformType) {
        case delta_store_1.PlatformType.GOOGLE:
            return new GoogleDeltaStoreConfig(phDeltaStoreConfig);
        default:
            throw `Unsupported platform type ${platformType}`;
    }
}
exports.createDeltaStoreConfig = createDeltaStoreConfig;
//# sourceMappingURL=DeltaStoreConfig.js.map