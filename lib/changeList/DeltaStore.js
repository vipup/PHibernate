"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
 * Created by Papa on 5/27/2016.
 */
const delta_store_1 = require("delta-store");
class DeltaStore {
    constructor(config, sharingAdaptor = null) {
        this.config = config;
        this.sharingAdaptor = sharingAdaptor;
        this.changeListMap = {};
        this.batchedChangeMap = {};
    }
    addChange(changeListConfig, changeRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.batchChanges) {
                let changeListName = this.getChangeListName(changeListConfig);
                let batchedChangeQueue = this.batchedChangeMap[changeListName];
                if (!batchedChangeQueue) {
                    batchedChangeQueue = [];
                    this.batchedChangeMap[changeListName] = batchedChangeQueue;
                }
                batchedChangeQueue.push(changeRecord);
                return changeRecord;
            }
            else {
                let changeList = this.getChangeList(changeListConfig);
                return yield changeList.addChanges([changeRecord]);
            }
        });
    }
    getChangeListName(changeListConfig) {
        return changeListConfig.changeListInfo.name;
    }
    getChangeList(changeListConfig) {
        let changeListName = this.getChangeListName(changeListConfig);
        let changeList = this.changeListMap[changeListName];
        return changeList;
    }
    goOffline() {
        this.changeListMap = {};
    }
    goOnline() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sharingAdaptor.initialize(this.config.setupInfo);
            yield this.setupChangeLists();
        });
    }
    setupChangeLists() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadChangeLists();
            let remoteLoadOps = [];
            let changeListConfigs = [];
            let changeListConfig = this.config.changeListConfig;
            let existingChangeListConfig = this.config.changeListConfig;
            let remoteLoadOp;
            if (this.config.changeListConfig.exists) {
                remoteLoadOp = this.sharingAdaptor.loadChangeList(this.config.setupInfo, changeListConfig.changeListInfo);
            }
            else {
                remoteLoadOp = this.sharingAdaptor.createChangeList(changeListConfig.changeListInfo.name, this.config.setupInfo);
                this.config.changeListConfig.exists = true;
            }
            changeListConfigs.push(changeListConfig);
            remoteLoadOps.push(remoteLoadOp);
            let loadResponses = yield Promise.all(remoteLoadOps);
            changeListConfigs.forEach((changeListConfig, index) => {
                let changeList = loadResponses[index];
                this.changeListMap[changeListConfig.changeListInfo.name] = changeList;
            });
            return null;
        });
    }
    loadChangeLists() {
        return __awaiter(this, void 0, void 0, function* () {
            let changeLists = yield this.sharingAdaptor.findExistingChangeLists(this.config.setupInfo);
            let changeListConfig = this.config.changeListConfig;
            changeLists.some((changeListShareInfo) => {
                if (changeListShareInfo.name === changeListConfig.changeListInfo.name) {
                    changeListConfig.exists = true;
                    changeListConfig.changeListInfo = changeListShareInfo;
                    return true;
                }
            });
            return null;
        });
    }
}
exports.DeltaStore = DeltaStore;
var GOOGLE_SHARING_ADAPTOR;
function getSharingAdaptor(platformType) {
    switch (platformType) {
        case delta_store_1.PlatformType.GOOGLE:
            if (!GOOGLE_SHARING_ADAPTOR) {
                GOOGLE_SHARING_ADAPTOR = getGooglesSharingAdaptor();
            }
            return GOOGLE_SHARING_ADAPTOR;
        default:
            throw `Unsupported PlatformType: ${platformType}`;
    }
}
exports.getSharingAdaptor = getSharingAdaptor;
function getGooglesSharingAdaptor() {
    let googleApi = getGoogleApi();
    let googleDrive = getGoogleDrive(googleApi);
    let googleDriveAdaptor = getGoogleDriveAdaptor(googleApi, googleDrive);
    let googleRealtime = getGoogleRealtime(googleDrive);
    let googleRealtimeAdaptor = getGoogleRealtimeAdaptor(googleRealtime);
    let googleSharingAdaptor = getGoogleSharingAdaptor(googleDrive, googleDriveAdaptor, googleRealtime, googleRealtimeAdaptor);
    return googleSharingAdaptor;
}
exports.getGooglesSharingAdaptor = getGooglesSharingAdaptor;
function getGoogleApi() {
    return new delta_store_1.GoogleApi();
}
function getGoogleDrive(googleApi) {
    return new delta_store_1.GoogleDrive(googleApi);
}
function getGoogleDriveAdaptor(googleApi, googleDrive) {
    return new delta_store_1.GoogleDriveAdaptor(googleApi, googleDrive);
}
function getGoogleRealtime(googleDrive) {
    return new delta_store_1.GoogleRealtime(googleDrive);
}
function getGoogleRealtimeAdaptor(googleRealtime) {
    return new delta_store_1.GoogleRealtimeAdaptor(googleRealtime);
}
function getGoogleSharingAdaptor(googleDrive, googleDriveAdaptor, googleRealtime, googleRealtimeAdaptor) {
    return new delta_store_1.GoogleSharingAdaptor(googleDrive, googleDriveAdaptor, googleRealtime, googleRealtimeAdaptor);
}
//# sourceMappingURL=DeltaStore.js.map