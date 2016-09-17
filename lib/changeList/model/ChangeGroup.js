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
const DeltaBackedRecord_1 = require("./DeltaBackedRecord");
/**
 * Created by Papa on 9/15/2016.
 */
let ChangeGroup = class ChangeGroup extends DeltaBackedRecord_1.DeltaBackedRecord {
};
__decorate([
    querydsl_typescript_1.Column({ name: "TYPE" }), 
    __metadata('design:type', Object)
], ChangeGroup.prototype, "type", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'changeGroup' }), 
    __metadata('design:type', Array)
], ChangeGroup.prototype, "entityChanges", void 0);
ChangeGroup = __decorate([
    querydsl_typescript_1.Entity(),
    querydsl_typescript_1.Table({ name: "CHANGE_GROUP" }), 
    __metadata('design:paramtypes', [])
], ChangeGroup);
exports.ChangeGroup = ChangeGroup;
//# sourceMappingURL=ChangeGroup.js.map