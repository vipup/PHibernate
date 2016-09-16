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
/**
 * Created by Papa on 9/15/2016.
 */
/**
 * Base record for all delta based
 */
class DeltaBackedRecord {
    static getId(createDeviceId, createDateTime, createUserId) {
        return `${createDeviceId}_${createDateTime.getTime()}_${createUserId}`;
    }
}
__decorate([
    querydsl_typescript_1.Id(),
    querydsl_typescript_1.Column({ name: 'ID' }), 
    __metadata('design:type', String)
], DeltaBackedRecord.prototype, "id", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: 'CREATE_DEVICE_ID' }), 
    __metadata('design:type', String)
], DeltaBackedRecord.prototype, "createDeviceId", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: 'CREATE_DATE_TIME' }), 
    __metadata('design:type', Date)
], DeltaBackedRecord.prototype, "createDateTime", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: 'CREATE_DEVICE_ID' }), 
    __metadata('design:type', String)
], DeltaBackedRecord.prototype, "createUserId", void 0);
exports.DeltaBackedRecord = DeltaBackedRecord;
//# sourceMappingURL=DeltaBackedRecord.js.map