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
const AbstractEntityChange_1 = require("./AbstractEntityChange");
let EntityWhereChange = class EntityWhereChange extends AbstractEntityChange_1.AbstractEntityChange {
};
__decorate([
    querydsl_typescript_1.Column({ name: "NUM_AFFECTED_RECORDS" }),
    __metadata("design:type", Number)
], EntityWhereChange.prototype, "numberOfAffectedRecords", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: "QUERY_JSON" }),
    __metadata("design:type", String)
], EntityWhereChange.prototype, "queryJson", void 0);
EntityWhereChange = __decorate([
    querydsl_typescript_1.Entity(),
    querydsl_typescript_1.Table({ name: "ENTITY_WHERE_CHANGE" }),
    __metadata("design:paramtypes", [])
], EntityWhereChange);
exports.EntityWhereChange = EntityWhereChange;
class StubWhereEntityChange extends AbstractEntityChange_1.StubAbstractEntityChange {
}
exports.StubWhereEntityChange = StubWhereEntityChange;
//# sourceMappingURL=EntityWhereChange.js.map