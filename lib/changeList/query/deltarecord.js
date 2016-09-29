"use strict";
const querydsl_typescript_1 = require('querydsl-typescript');
// Entity Query Implementation
class QDeltaRecord extends querydsl_typescript_1.QEntity {
    // Relations
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.id = new querydsl_typescript_1.QStringField(this, QDeltaRecord, 'DeltaRecord', 'id');
        this.createDeviceId = new querydsl_typescript_1.QStringField(this, QDeltaRecord, 'DeltaRecord', 'createDeviceId');
        this.createDateTime = new querydsl_typescript_1.QDateField(this, QDeltaRecord, 'DeltaRecord', 'createDateTime');
        this.createUserId = new querydsl_typescript_1.QStringField(this, QDeltaRecord, 'DeltaRecord', 'createUserId');
    }
    toJSON() {
        throw 'Not Implemented';
    }
}
exports.QDeltaRecord = QDeltaRecord;
//# sourceMappingURL=deltarecord.js.map