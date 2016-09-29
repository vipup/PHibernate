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
const entitychange_1 = require("../../query/entitychange");
/**
 * Created by Papa on 9/24/2016.
 */
class OfflineSqlDeltaStore {
    constructor(localStore, config) {
        this.localStore = localStore;
        this.config = config;
    }
    addRemoteChanges(changeRecords) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityIdMap = {};
            let earliestDate = changeRecords.map((changeRecord) => {
                changeRecord.entityChanges.forEach((entityChange) => {
                    entityChange.changedEntityId;
                    entityIdMap[entityChange.changedEntityId] = true;
                });
                return changeRecord.createDateTime;
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
            let cg, ec;
            let localChangeRecords = yield changegroup_1.QChangeGroup.find({
                select: {
                    id: null
                },
                from: [
                    cg = changegroup_1.QChangeGroup.from,
                    ec = cg.innerJoin(entitychange_1.QEntityChange.from)
                ],
                where: querydsl_typescript_1.and(cg.createDateTime.greaterThanOrEquals(earliestDate), ec.changedEntityId.isIn(entityIds))
            });
            return null;
        });
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