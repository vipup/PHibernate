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
const AbstractFieldChange_1 = require("./AbstractFieldChange");
/**
 * Created by Papa on 9/15/2016.
 */
let StringFieldChange = class StringFieldChange extends AbstractFieldChange_1.AbstractFieldChange {
};
__decorate([
    querydsl_typescript_1.Column({ name: "NEW_VALUE" }), 
    __metadata('design:type', String)
], StringFieldChange.prototype, "newValue", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: "OLD_VALUE" }), 
    __metadata('design:type', String)
], StringFieldChange.prototype, "oldValue", void 0);
StringFieldChange = __decorate([
    querydsl_typescript_1.Entity(),
    querydsl_typescript_1.Table({ name: "STRING_FIELD_CHANGE" }), 
    __metadata('design:paramtypes', [])
], StringFieldChange);
exports.StringFieldChange = StringFieldChange;
//# sourceMappingURL=StringFieldChange.js.map