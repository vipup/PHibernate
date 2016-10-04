"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const decorators_1 = require("../../../core/metadata/decorators");
const AbstractEntityChange_1 = require("../../model/AbstractEntityChange");
/**
 * Created by Papa on 9/24/2016.
 */
(function (ChangeGroupOrigin) {
    ChangeGroupOrigin[ChangeGroupOrigin["LOCAL"] = 0] = "LOCAL";
    ChangeGroupOrigin[ChangeGroupOrigin["REMOTE"] = 1] = "REMOTE";
})(exports.ChangeGroupOrigin || (exports.ChangeGroupOrigin = {}));
var ChangeGroupOrigin = exports.ChangeGroupOrigin;
class PHRemoteSQLUpdate extends querydsl_typescript_1.PHSQLUpdate {
    constructor(phJsonSqlQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        super(null, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
        this.phJsonSqlQuery = phJsonSqlQuery;
    }
    toSQL() {
        return this.phJsonSqlQuery;
    }
}
class PHRemoteSQLDelete extends querydsl_typescript_1.PHSQLDelete {
    constructor(phJsonSqlQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        super(null, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
        this.phJsonSqlQuery = phJsonSqlQuery;
    }
    toSQL() {
        return this.phJsonSqlQuery;
    }
}
class OfflineSqlDeltaStore {
    constructor(localStore, config) {
        this.localStore = localStore;
        this.config = config;
    }
    /**
     * Remote updates (do not code any optimizations until there is a test suite in place)
     In a single Transaction:
     1)  Find all local change records for each remotely changed entity since the first remote records
     2)  Filter out any remote changes that are already in the local store
     3)  Save remaining remote Change Groups
     4)  Add all local and remote changes into a single list and order
     5)  Prune all deleted entities from the point of their deletion forward
     6)  Re-execute all pruned ChangeGroups in order
     7)  Notify all matching attached queries of changes

     * @param changeGroups
     * @returns {ChangeGroupApi[]}
     */
    addRemoteChanges(changeGroups) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityIdMap = {};
            let remoteChangeGroupMap = {};
            let earliestDate = changeGroups.map((changeGroup) => {
                remoteChangeGroupMap[changeGroup.id] = changeGroup;
                changeGroup.entityChanges.sort(this.sortEntityChanges);
                changeGroup.entityChanges.forEach((entityChange) => {
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
            // 1) Find all local records for these entities since the time of the first incoming change
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
            // 2)  Filter out any remote changes that are already in the local store
            let localChangeGroupsWithOrigin = localChangeGroups.map((changeGroup) => {
                delete remoteChangeGroupMap[changeGroup.id];
                changeGroup.entityChanges.sort(this.sortEntityChanges);
                return {
                    origin: ChangeGroupOrigin.LOCAL,
                    changeGroup: changeGroup
                };
            });
            // 3)  Save remaining remote Change Groups
            let remoteChangeGroupsWithOrigin = [];
            for (let id in remoteChangeGroupMap) {
                let remoteChangeGroup = remoteChangeGroupMap[id];
                this.addChange(remoteChangeGroup);
                remoteChangeGroupsWithOrigin.push({
                    origin: ChangeGroupOrigin.REMOTE,
                    changeGroup: remoteChangeGroup
                });
            }
            // 4)  Add all local and remote changes into a single list and order
            let changeGroupsWithOrigin = remoteChangeGroupsWithOrigin.concat(localChangeGroupsWithOrigin);
            changeGroupsWithOrigin.sort(this.sortChangeGroupsWithOrigin);
            // 4a)  Impl detail: Ignore all local changes before the first remote change group
            let lastPriorLocalChangeIndex = -1;
            changeGroupsWithOrigin.some((changeGroupWithOrigin) => {
                switch (changeGroupWithOrigin.origin) {
                    case ChangeGroupOrigin.LOCAL:
                        // Ignore any local changes before any remote changes
                        lastPriorLocalChangeIndex++;
                        return false;
                    case ChangeGroupOrigin.REMOTE:
                        return true;
                }
            });
            changeGroupsWithOrigin = changeGroupsWithOrigin.slice(lastPriorLocalChangeIndex + 1, changeGroupsWithOrigin.length);
            // 5)  Prune all deleted entities from the point of their deletion forward
            let deletedEntityMap = {};
            changeGroupsWithOrigin.forEach((changeGroupWithOrigin) => {
                let entityChanges = changeGroupWithOrigin.changeGroup.entityChanges;
                for (let i = entityChanges.length - 1; i >= 0; i--) {
                    let entityChange = entityChanges[i];
                    let deletedEntitiesOfType = deletedEntityMap[entityChange.entityName];
                    if (!deletedEntitiesOfType) {
                        deletedEntitiesOfType = {};
                        deletedEntityMap[entityChange.entityName] = deletedEntitiesOfType;
                    }
                    if (deletedEntitiesOfType[entityChange.changedEntityId]) {
                        entityChanges.splice(i, 1);
                        continue;
                    }
                    if (entityChange.changeType === AbstractEntityChange_1.EntityChangeType.DELETE) {
                        deletedEntitiesOfType[entityChange.changedEntityId] = entityChange;
                    }
                }
            });
            // 6)  Re-execute all pruned ChangeGroups in order
            changeGroupsWithOrigin.forEach((changeGroupWithOrigin) => {
                changeGroupWithOrigin.changeGroup;
            });
            // 7)  Notify all matching attached queries of changes
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
__decorate([
    decorators_1.Transactional(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], OfflineSqlDeltaStore.prototype, "addRemoteChanges", null);
//# sourceMappingURL=OfflineSqlDeltaStore.js.map