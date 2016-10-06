"use strict";
const querydsl_typescript_1 = require("querydsl-typescript");
const deltarecord_1 = require("./deltarecord");
const changegroup_1 = require("../model/changegroup");
const changegroup_2 = require("./changegroup");
// Entity Query Implementation
class QAbstractEntityChange extends deltarecord_1.QDeltaRecord {
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.entityName = new querydsl_typescript_1.QStringField(this, QAbstractEntityChange, 'AbstractEntityChange', 'entityName');
        this.changeType = new querydsl_typescript_1.QNumberField(this, QAbstractEntityChange, 'AbstractEntityChange', 'changeType');
        this.entityChangeIdInGroup = new querydsl_typescript_1.QNumberField(this, QAbstractEntityChange, 'AbstractEntityChange', 'entityChangeIdInGroup');
        // Relations
        this.changeGroup = new querydsl_typescript_1.QRelation(this, QAbstractEntityChange, querydsl_typescript_1.RelationType.MANY_TO_ONE, 'ChangeGroup', 'changeGroup', changegroup_1.ChangeGroup, changegroup_2.QChangeGroup);
    }
    toJSON() {
        throw 'Not Implemented';
    }
}
exports.QAbstractEntityChange = QAbstractEntityChange;
//# sourceMappingURL=abstractentitychange.js.map