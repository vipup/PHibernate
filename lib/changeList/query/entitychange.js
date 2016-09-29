"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const querydsl_typescript_1 = require('querydsl-typescript');
const entitychange_1 = require('../model/entitychange');
const deltarecord_1 = require('./deltarecord');
const PH_1 = require('../../config/PH');
const booleanfieldchange_1 = require('../model/booleanfieldchange');
const booleanfieldchange_2 = require('./booleanfieldchange');
const datefieldchange_1 = require('../model/datefieldchange');
const datefieldchange_2 = require('./datefieldchange');
const numberfieldchange_1 = require('../model/numberfieldchange');
const numberfieldchange_2 = require('./numberfieldchange');
const stringfieldchange_1 = require('../model/stringfieldchange');
const stringfieldchange_2 = require('./stringfieldchange');
const changegroup_1 = require('../model/changegroup');
const changegroup_2 = require('./changegroup');
// Entity Query Implementation
class QEntityChange extends deltarecord_1.QDeltaRecord {
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.entityName = new querydsl_typescript_1.QStringField(this, QEntityChange, 'EntityChange', 'entityName');
        this.changeType = new querydsl_typescript_1.QNumberField(this, QEntityChange, 'EntityChange', 'changeType');
        this.changedEntityId = new querydsl_typescript_1.QStringField(this, QEntityChange, 'EntityChange', 'changedEntityId');
        this.entityChangeIdInGroup = new querydsl_typescript_1.QNumberField(this, QEntityChange, 'EntityChange', 'entityChangeIdInGroup');
        this.numberOfFieldsInEntity = new querydsl_typescript_1.QNumberField(this, QEntityChange, 'EntityChange', 'numberOfFieldsInEntity');
        // Relations
        this.booleanFieldChanges = new querydsl_typescript_1.QRelation(this, QEntityChange, querydsl_typescript_1.RelationType.ONE_TO_MANY, 'BooleanFieldChange', 'booleanFieldChanges', booleanfieldchange_1.BooleanFieldChange, booleanfieldchange_2.QBooleanFieldChange);
        this.dateFieldChanges = new querydsl_typescript_1.QRelation(this, QEntityChange, querydsl_typescript_1.RelationType.ONE_TO_MANY, 'DateFieldChange', 'dateFieldChanges', datefieldchange_1.DateFieldChange, datefieldchange_2.QDateFieldChange);
        this.numberFieldChanges = new querydsl_typescript_1.QRelation(this, QEntityChange, querydsl_typescript_1.RelationType.ONE_TO_MANY, 'NumberFieldChange', 'numberFieldChanges', numberfieldchange_1.NumberFieldChange, numberfieldchange_2.QNumberFieldChange);
        this.stringFieldChanges = new querydsl_typescript_1.QRelation(this, QEntityChange, querydsl_typescript_1.RelationType.ONE_TO_MANY, 'StringFieldChange', 'stringFieldChanges', stringfieldchange_1.StringFieldChange, stringfieldchange_2.QStringFieldChange);
        this.changeGroup = new querydsl_typescript_1.QRelation(this, QEntityChange, querydsl_typescript_1.RelationType.MANY_TO_ONE, 'ChangeGroup', 'changeGroup', changegroup_1.ChangeGroup, changegroup_2.QChangeGroup);
    }
    toJSON() {
        throw 'Not Implemented';
    }
    static find(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.find(entitychange_1.EntityChange, queryDefinition);
        });
    }
    static findOne(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.findOne(entitychange_1.EntityChange, queryDefinition);
        });
    }
    static search(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.search(entitychange_1.EntityChange, queryDefinition, subject);
    }
    static searchOne(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.searchOne(entitychange_1.EntityChange, queryDefinition, subject);
    }
    static create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.create(entitychange_1.EntityChange, entity);
        });
    }
    static update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.update(entitychange_1.EntityChange, entity);
        });
    }
    static delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.delete(entitychange_1.EntityChange, entity);
        });
    }
    static save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.save(entitychange_1.EntityChange, entity);
        });
    }
}
QEntityChange.from = new QEntityChange(entitychange_1.EntityChange, 'EntityChange', 'EntityChange');
exports.QEntityChange = QEntityChange;
PH_1.PH.addQEntity(entitychange_1.EntityChange, QEntityChange.from);
//# sourceMappingURL=entitychange.js.map