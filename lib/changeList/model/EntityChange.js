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
const ChangeGroup_1 = require("./ChangeGroup");
const DeltaBackedRecord_1 = require("./DeltaBackedRecord");
/**
 * Created by Papa on 9/15/2016.
 */
let EntityChange = class EntityChange extends DeltaBackedRecord_1.DeltaBackedRecord {
};
__decorate([
    querydsl_typescript_1.Column({ name: "ENTITY_NAME" }), 
    __metadata('design:type', String)
], EntityChange.prototype, "entityName", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: 'ENTITY_CREATE_DEVICE_ID' }), 
    __metadata('design:type', String)
], EntityChange.prototype, "entityCreateDeviceId", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: 'ENTITY_CREATE_DATE_TIME' }), 
    __metadata('design:type', Date)
], EntityChange.prototype, "entityCreateDateTime", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: 'ENTITY_CREATE_DEVICE_ID' }), 
    __metadata('design:type', String)
], EntityChange.prototype, "entityCreateUserId", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'entityChange' }), 
    __metadata('design:type', Array)
], EntityChange.prototype, "booleanFieldChanges", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'entityChange' }), 
    __metadata('design:type', Array)
], EntityChange.prototype, "dateFieldChanges", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'entityChange' }), 
    __metadata('design:type', Array)
], EntityChange.prototype, "numberFieldChanges", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'entityChange' }), 
    __metadata('design:type', Array)
], EntityChange.prototype, "stringFieldChanges", void 0);
__decorate([
    querydsl_typescript_1.ManyToOne(),
    querydsl_typescript_1.JoinColumn({ name: "CHANGE_ID", nullable: false }), 
    __metadata('design:type', ChangeGroup_1.ChangeGroup)
], EntityChange.prototype, "changeGroup", void 0);
EntityChange = __decorate([
    querydsl_typescript_1.Entity(),
    querydsl_typescript_1.Table({ name: "ENTITY_CHANGE" }), 
    __metadata('design:paramtypes', [])
], EntityChange);
exports.EntityChange = EntityChange;
//# sourceMappingURL=EntityChange.js.map