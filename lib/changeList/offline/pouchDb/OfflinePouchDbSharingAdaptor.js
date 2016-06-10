/**
 * Created by Papa on 5/28/2016.
 */
"use strict";
const delta_store_1 = require("delta-store");
class OfflinePouchDbSharingAdaptor {
    initialize(setupInfo) {
        return null;
    }
    findExistingChangeLists(setupInfo) {
        return null;
    }
    createChangeList(name, setupInfo) {
        return null;
    }
    loadChangeList(shareInfo) {
        return null;
    }
    setupInfoBelongsTo(setupInfo, setupInfos) {
        if (setupInfo.platformType !== delta_store_1.PlatformType.OFFLINE) {
            return false;
        }
        return setupInfos.some((otherSetupInfo) => {
            if (otherSetupInfo.platformType === delta_store_1.PlatformType.OFFLINE) {
                return setupInfo.apiKey === otherSetupInfo.apiKey
                    && setupInfo.clientId === otherSetupInfo.clientId;
            }
        });
    }
}
exports.OfflinePouchDbSharingAdaptor = OfflinePouchDbSharingAdaptor;
//# sourceMappingURL=OfflinePouchDbSharingAdaptor.js.map