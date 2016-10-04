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
const DeltaRecord_1 = require("./DeltaRecord");
const querydsl_typescript_1 = require("querydsl-typescript");
const ChangeGroup_1 = require("./ChangeGroup");
/**
 * Created by Papa on 10/4/2016.
 */
(function (EntityChangeType) {
    EntityChangeType[EntityChangeType["CREATE"] = 0] = "CREATE";
    EntityChangeType[EntityChangeType["DELETE"] = 1] = "DELETE";
    EntityChangeType[EntityChangeType["DELETE_WHERE"] = 2] = "DELETE_WHERE";
    EntityChangeType[EntityChangeType["UPDATE"] = 3] = "UPDATE";
    EntityChangeType[EntityChangeType["UPDATE_WHERE"] = 4] = "UPDATE_WHERE";
})(exports.EntityChangeType || (exports.EntityChangeType = {}));
var EntityChangeType = exports.EntityChangeType;
let AbstractEntityChange = class AbstractEntityChange extends DeltaRecord_1.DeltaRecord {
    static getEntityChangeId(entityIdInGroup, createDeviceId, createDateTime, createUserId, indexInMillisecond) {
        return `${entityIdInGroup}_${createDeviceId}_${createDateTime.getTime()}_${indexInMillisecond}_${createUserId}`;
    }
};
__decorate([
    querydsl_typescript_1.Column({ name: "ENTITY_NAME" }),
    __metadata("design:type", String)
], AbstractEntityChange.prototype, "entityName", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: "CHANGE_TYPE" }),
    __metadata("design:type", Number)
], AbstractEntityChange.prototype, "changeType", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: "ENTITY_CHANGE_ID_IN_GROUP" }),
    __metadata("design:type", Number)
], AbstractEntityChange.prototype, "entityChangeIdInGroup", void 0);
__decorate([
    querydsl_typescript_1.ManyToOne(),
    querydsl_typescript_1.JoinColumn({ name: "CHANGE_GROUP_ID", nullable: false }),
    __metadata("design:type", ChangeGroup_1.ChangeGroup)
], AbstractEntityChange.prototype, "changeGroup", void 0);
AbstractEntityChange = __decorate([
    querydsl_typescript_1.MappedSuperclass(),
    __metadata("design:paramtypes", [])
], AbstractEntityChange);
exports.AbstractEntityChange = AbstractEntityChange;
class StubAbstractEntityChange {
}
exports.StubAbstractEntityChange = StubAbstractEntityChange;
//# sourceMappingURL=AbstractEntityChange.js.map