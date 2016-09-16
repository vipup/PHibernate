/**
 * Created by Papa on 9/15/2016.
 */
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
class AbstractChangeRecord {
}
__decorate([
    querydsl_typescript_1.Column({ name: "CHANGE_ID" }),
    querydsl_typescript_1.Id(), 
    __metadata('design:type', Object)
], AbstractChangeRecord.prototype, "changeId", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: "CHANGE_TIME" }), 
    __metadata('design:type', Object)
], AbstractChangeRecord.prototype, "changeTime", void 0);
exports.AbstractChangeRecord = AbstractChangeRecord;
//# sourceMappingURL=AbstractChangeRecord.js.map