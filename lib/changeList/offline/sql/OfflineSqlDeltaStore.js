"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const ChangeGroup_1 = require("../../model/ChangeGroup");
const changegroup_1 = require("../../query/changegroup");
const querydsl_typescript_1 = require("querydsl-typescript");
/**
 * Created by Papa on 9/24/2016.
 */
(function (ChangeGroupOrigin) {
    ChangeGroupOrigin[ChangeGroupOrigin["LOCAL"] = 0] = "LOCAL";
    ChangeGroupOrigin[ChangeGroupOrigin["REMOTE"] = 1] = "REMOTE";
})(exports.ChangeGroupOrigin || (exports.ChangeGroupOrigin = {}));
var ChangeGroupOrigin = exports.ChangeGroupOrigin;
class OfflineSqlDeltaStore {
    constructor(localStore, config) {
        this.localStore = localStore;
        this.config = config;
    }
    addRemoteChanges(changeGroups) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityIdMap = {};
            let remoteChangeGroupsWithOrigin = [];
            let earliestDate = changeGroups.map((changeGroup) => {
                remoteChangeGroupsWithOrigin.push({
                    origin: ChangeGroupOrigin.REMOTE,
                    changeGroup: changeGroup
                });
                changeGroup.entityChanges.sort(this.sortEntityChanges);
                changeGroup.entityChanges.forEach((entityChange) => {
                    entityChange.changedEntityId;
                    entityIdMap[entityChange.changedEntityId] = true;
                });
                return changeGroup.createDateTime;
            }).reduce((previousDate, currentDate) => {
                if (previousDate.getTime() > currentDate.getTime()) {
                    return currentDate;
                }
                return previousDate;
            });
            let entityIds = [];
            for (let entityId in entityIdMap) {
                entityIds.push(entityId);
            }
            // Find all local records for these entities since the time of the first incoming change
            let cg, ec;
            let localChangeGroups = yield changegroup_1.QChangeGroup.find({
                select: {
                    '*': null,
                    entityChanges: {
                        '*': null,
                        booleanFieldChanges: {},
                        dateFieldChanges: {},
                        numberFieldChanges: {},
                        stringFieldChanges: {}
                    },
                },
                from: [
                    cg = changegroup_1.QChangeGroup.from,
                    ec = cg.entityChanges.innerJoin()
                ],
                where: querydsl_typescript_1.and(cg.createDateTime.greaterThanOrEquals(earliestDate), ec.changedEntityId.isIn(entityIds))
            });
            changeGroups.sort(this.sortChangeGroups);
            localChangeGroups.sort(this.sortChangeGroups);
            if (localChangeGroups.length) {
                this.filterOutOverwrittenChanges(changeGroups, localChangeGroups);
            }
            return changeGroups;
        });
    }
    /**
     * Remove any modifications that were later updated by another change
     * @param changeGroups  remotely created change groups
     * @param localChangeGroups locally created change groups
     */
    filterOutOverwrittenChanges(changeGroups, localChangeGroups) {
        let currLocalCGIndex = 0;
        changeGroups.forEach((changeGroup) => {
            while (currLocalCGIndex < localChangeGroups.length) {
                let localChangeGroup = localChangeGroups[currLocalCGIndex];
                if (this.sortChangeGroups(changeGroup, localChangeGroup) > 0) {
                    break;
                }
            }
        });
    }
    sortChangeGroupsWithOrigin(cgo1, cgo2) {
        return this.sortChangeGroups(cgo1.changeGroup, cgo2.changeGroup);
    }
    sortChangeGroups(cg1, cg2) {
        let time1 = cg1.createDateTime.getTime();
        let time2 = cg2.createDateTime.getTime();
        if (time1 > time2) {
            return 1;
        }
        if (time2 > time1) {
            return -1;
        }
        let deviceId1 = cg1.createDeviceId;
        let deviceId2 = cg2.createDeviceId;
        if (deviceId1 > deviceId2) {
            return 1;
        }
        if (deviceId2 > deviceId1) {
            return -1;
        }
        let userId1 = cg1.createUserId;
        let userId2 = cg2.createUserId;
        if (userId1 > userId2) {
            return 1;
        }
        if (userId2 > userId1) {
            return -1;
        }
        let inMilliIdx1 = cg1.groupIndexInMillisecond;
        let inMilliIdx2 = cg2.groupIndexInMillisecond;
        if (inMilliIdx1 > inMilliIdx2) {
            return 1;
        }
        if (inMilliIdx2 > inMilliIdx1) {
            return -1;
        }
        return 0;
    }
    sortEntityChanges(ec1, ec2) {
        let id1 = ec1.entityChangeIdInGroup;
        let id2 = ec2.entityChangeIdInGroup;
        if (id1 > id2) {
            return 1;
        }
        if (id2 > id1) {
            return -1;
        }
        return 0;
    }
    addChange(changeRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.localStore.create('ChangeGroup', changeRecord, new ChangeGroup_1.StubChangeGroup());
            return null;
        });
    }
    findChangesForEntitiesWithFieldsSinceTime(entityChanges) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    findUnsyncedChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    markChangesAsSynced(changeGroups) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
}
exports.OfflineSqlDeltaStore = OfflineSqlDeltaStore;
//# sourceMappingURL=OfflineSqlDeltaStore.js.map