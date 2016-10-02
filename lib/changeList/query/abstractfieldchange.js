"use strict";
const querydsl_typescript_1 = require("querydsl-typescript");
const deltarecord_1 = require("./deltarecord");
const entitychange_1 = require("../model/entitychange");
const entitychange_2 = require("./entitychange");
// Entity Query Implementation
class QAbstractFieldChange extends deltarecord_1.QDeltaRecord {
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.propertyName = new querydsl_typescript_1.QStringField(this, QAbstractFieldChange, 'AbstractFieldChange', 'propertyName');
        // Relations
        this.entityChange = new querydsl_typescript_1.QRelation(this, QAbstractFieldChange, querydsl_typescript_1.RelationType.MANY_TO_ONE, 'EntityChange', 'entityChange', entitychange_1.EntityChange, entitychange_2.QEntityChange);
    }
    toJSON() {
        throw 'Not Implemented';
    }
}
exports.QAbstractFieldChange = QAbstractFieldChange;
//# sourceMappingURL=abstractfieldchange.js.map