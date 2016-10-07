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
const querydsl_typescript_1 = require("querydsl-typescript");
const EntityChange_1 = require("./EntityChange");
const DeltaRecord_1 = require("./DeltaRecord");
const AbstractFieldChange_1 = require("./AbstractFieldChange");
const PlatformUtils_1 = require("../../shared/PlatformUtils");
const UserUtils_1 = require("../../shared/UserUtils");
const EntityWhereChange_1 = require("./EntityWhereChange");
const AbstractEntityChange_1 = require("./AbstractEntityChange");
/**
 * Created by Papa on 9/15/2016.
 */
(function (SyncStatus) {
    SyncStatus[SyncStatus["SYNCHRONIZED"] = 0] = "SYNCHRONIZED";
    SyncStatus[SyncStatus["CLIENT_CHANGES_SYNC_PENDING"] = 1] = "CLIENT_CHANGES_SYNC_PENDING";
    SyncStatus[SyncStatus["REMOTE_CHANGES_SYNC_PENDING"] = 2] = "REMOTE_CHANGES_SYNC_PENDING";
})(exports.SyncStatus || (exports.SyncStatus = {}));
var SyncStatus = exports.SyncStatus;
let ChangeGroup_1 = class ChangeGroup extends DeltaRecord_1.DeltaRecord {
    constructor() {
        super(...arguments);
        this.entityChanges = [];
        this.entityWhereChanges = [];
        this.numberOfEntitiesInGroup = 0;
        this.syncStatus = SyncStatus.CLIENT_CHANGES_SYNC_PENDING;
    }
    static getNewChangeGroup(type, idGenerator) {
        let changeGroup = new ChangeGroup_1();
        let createDate = new Date();
        let deviceId = PlatformUtils_1.PlatformUtils.getDeviceAddress();
        let userId = UserUtils_1.UserUtils.getUserId();
        changeGroup.type = type;
        changeGroup.createDateTime = createDate;
        changeGroup.createDeviceId = deviceId;
        changeGroup.createUserId = userId;
        changeGroup.numberOfEntitiesInGroup = 0;
        changeGroup.id = idGenerator.generateChangeGroupId(changeGroup);
        return changeGroup;
    }
    addNewCreateEntityChange(entityName, entity, idProperty, idGenerator) {
        if (entity instanceof ChangeGroup_1 || entity instanceof AbstractEntityChange_1.AbstractEntityChange || entity instanceof AbstractFieldChange_1.AbstractFieldChange) {
            return new EntityChange_1.StubEntityChange();
        }
        let entityChange = this.addNewEntityChange(entityName);
        entityChange.changeType = AbstractEntityChange_1.EntityChangeType.CREATE;
        if (!entity[idProperty]) {
            entity[idProperty] = entityChange.changedEntityId = idGenerator.generateEntityId(entity, entityChange);
        }
        return entityChange;
    }
    addNewDeleteEntityChange(entityName, entity, idProperty) {
        if (entity instanceof ChangeGroup_1 || entity instanceof AbstractEntityChange_1.AbstractEntityChange || entity instanceof AbstractFieldChange_1.AbstractFieldChange) {
            return new EntityChange_1.StubEntityChange();
        }
        let entityChange = this.addNewEntityChange(entityName);
        entityChange.changeType = AbstractEntityChange_1.EntityChangeType.DELETE;
        entityChange.changedEntityId = entity[idProperty];
        return entityChange;
    }
    addNewDeleteWhereEntityChange(entityName, numberOfAffectedRecords, phJsonSqlDelete) {
        let entityWhereChange = this.addNewEntityWhereChange(entityName, numberOfAffectedRecords);
        entityWhereChange.changeType = AbstractEntityChange_1.EntityChangeType.DELETE_WHERE;
        entityWhereChange.queryJson = JSON.stringify(phJsonSqlDelete);
        return entityWhereChange;
    }
    addNewUpdateEntityChange(entityName, entity, idProperty) {
        if (entity instanceof ChangeGroup_1 || entity instanceof EntityChange_1.EntityChange || entity instanceof AbstractFieldChange_1.AbstractFieldChange) {
            return new EntityChange_1.StubEntityChange();
        }
        let entityChange = this.addNewEntityChange(entityName);
        entityChange.changeType = AbstractEntityChange_1.EntityChangeType.UPDATE;
        entityChange.changedEntityId = entity[idProperty];
        return entityChange;
    }
    addNewUpdateWhereEntityChange(entityName, numberOfAffectedRecords, phJsonSqlUpdate) {
        let entityWhereChange = this.addNewEntityWhereChange(entityName, numberOfAffectedRecords);
        entityWhereChange.changeType = AbstractEntityChange_1.EntityChangeType.UPDATE_WHERE;
        entityWhereChange.queryJson = JSON.stringify(phJsonSqlUpdate);
        return entityWhereChange;
    }
    addNewEntityChange(entityName) {
        let entityChange = new EntityChange_1.EntityChange();
        this.setupAbstractEntityChange(entityName, entityChange);
        this.entityChanges.push(entityChange);
        entityChange.numberOfFieldsInEntity = 0;
        return entityChange;
    }
    addNewEntityWhereChange(entityName, numberOfAffectedRecords) {
        let entityWhereChange = new EntityWhereChange_1.EntityWhereChange();
        this.setupAbstractEntityChange(entityName, entityWhereChange);
        entityWhereChange.numberOfAffectedRecords = numberOfAffectedRecords;
        this.entityWhereChanges.push(entityWhereChange);
        return entityWhereChange;
    }
    setupAbstractEntityChange(entityName, abstractEntityChange) {
        abstractEntityChange.entityChangeIdInGroup = ++this.numberOfEntitiesInGroup;
        abstractEntityChange.changeGroup = this;
        abstractEntityChange.createDateTime = this.createDateTime;
        abstractEntityChange.createDeviceId = this.createDeviceId;
        abstractEntityChange.createUserId = this.createUserId;
        abstractEntityChange.entityName = entityName;
        abstractEntityChange.id = AbstractEntityChange_1.AbstractEntityChange.getEntityChangeId(abstractEntityChange.entityChangeIdInGroup, this.createDeviceId, this.createDateTime, this.createUserId, this.groupIndexInMillisecond);
    }
};
let ChangeGroup = ChangeGroup_1;
__decorate([
    querydsl_typescript_1.Column({ name: "TYPE" }),
    __metadata("design:type", String)
], ChangeGroup.prototype, "type", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'changeGroup' }),
    __metadata("design:type", Array)
], ChangeGroup.prototype, "entityChanges", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'changeGroup' }),
    __metadata("design:type", Array)
], ChangeGroup.prototype, "entityWhereChanges", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: "NUM_ENTITIES_IN_GROUP" }),
    __metadata("design:type", Number)
], ChangeGroup.prototype, "numberOfEntitiesInGroup", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: "GROUP_INDEX_IN_MILLISECOND" }),
    __metadata("design:type", Number)
], ChangeGroup.prototype, "groupIndexInMillisecond", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: "SYNC_STATUS" }),
    __metadata("design:type", Number)
], ChangeGroup.prototype, "syncStatus", void 0);
ChangeGroup = ChangeGroup_1 = __decorate([
    querydsl_typescript_1.Entity(),
    querydsl_typescript_1.Table({ name: "CHANGE_GROUP" }),
    __metadata("design:paramtypes", [])
], ChangeGroup);
exports.ChangeGroup = ChangeGroup;
class StubChangeGroup extends DeltaRecord_1.StubDeltaRecord {
    addNewCreateEntityChange(entityName, entity, idProperty, idGenerator) {
        return new EntityChange_1.StubEntityChange();
    }
    addNewDeleteEntityChange(entityName, entity, idProperty) {
        return new EntityChange_1.StubEntityChange();
    }
    addNewDeleteWhereEntityChange(entityName, numberOfAffectedRecords, phJsonSqlDelete) {
        return new EntityWhereChange_1.StubWhereEntityChange();
    }
    addNewUpdateEntityChange(entityName, entity, idProperty) {
        return new EntityChange_1.StubEntityChange();
    }
    addNewUpdateWhereEntityChange(entityName, numberOfAffectedRecords, phJsonSqlUpdate) {
        return new EntityWhereChange_1.StubWhereEntityChange();
    }
}
exports.StubChangeGroup = StubChangeGroup;
//# sourceMappingURL=ChangeGroup.js.map