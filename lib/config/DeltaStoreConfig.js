/**
 * Created by Papa on 5/31/2016.
 */
"use strict";
const delta_store_1 = require("delta-store");
class DeltaStoreConfig {
    constructor(deltaStoreName, config) {
        this.deltaStoreName = deltaStoreName;
        this.changeListConfigMap = {};
        if (!config.platform) {
            throw `Sharing Platform is not defined`;
        }
        let platformType = getPlatformType(config.platform);
        this.setupInfo = {
            changeTimeField: config.changeTimeField,
            changeTypeField: config.changeTypeField,
            changeUserField: config.changeUserField,
            platformType: platformType,
            recordIdField: config.recordIdField
        };
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
    constructor(deltaStoreName, config) {
        super(deltaStoreName, config);
        this.config = config;
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
function createDeltaStoreConfig(deltaStoreName, phDeltaStoreConfig) {
    if (!phDeltaStoreConfig.platform) {
        throw `deltaStore.platform is nod specified`;
    }
    let platformType = getPlatformType(phDeltaStoreConfig.platform);
    switch (platformType) {
        case delta_store_1.PlatformType.GOOGLE:
            return new GoogleDeltaStoreConfig(deltaStoreName, phDeltaStoreConfig);
        default:
            throw `Unsupported platform type ${platformType}`;
    }
}
exports.createDeltaStoreConfig = createDeltaStoreConfig;
//# sourceMappingURL=DeltaStoreConfig.js.map