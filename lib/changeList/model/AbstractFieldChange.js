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
const EntityChange_1 = require("./EntityChange");
const querydsl_typescript_1 = require("querydsl-typescript");
const DeltaBackedRecord_1 = require("./DeltaBackedRecord");
/**
 * Created by Papa on 9/15/2016.
 */
class AbstractFieldChange extends DeltaBackedRecord_1.DeltaBackedRecord {
}
__decorate([
    querydsl_typescript_1.Column({ name: "FIELD_NAME" }), 
    __metadata('design:type', String)
], AbstractFieldChange.prototype, "fieldName", void 0);
__decorate([
    querydsl_typescript_1.ManyToOne(),
    querydsl_typescript_1.JoinColumn({ name: "ENTITY_CHANGE_ID", nullable: false }), 
    __metadata('design:type', EntityChange_1.EntityChange)
], AbstractFieldChange.prototype, "entityChange", void 0);
exports.AbstractFieldChange = AbstractFieldChange;
//# sourceMappingURL=AbstractFieldChange.js.map