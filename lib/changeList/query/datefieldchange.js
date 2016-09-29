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
const datefieldchange_1 = require('../model/datefieldchange');
const abstractfieldchange_1 = require('./abstractfieldchange');
const PH_1 = require('../../config/PH');
// Entity Query Implementation
class QDateFieldChange extends abstractfieldchange_1.QAbstractFieldChange {
    // Relations
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.newValue = new querydsl_typescript_1.QDateField(this, QDateFieldChange, 'DateFieldChange', 'newValue');
        this.oldValue = new querydsl_typescript_1.QDateField(this, QDateFieldChange, 'DateFieldChange', 'oldValue');
    }
    toJSON() {
        throw 'Not Implemented';
    }
    static find(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.find(datefieldchange_1.DateFieldChange, queryDefinition);
        });
    }
    static findOne(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.findOne(datefieldchange_1.DateFieldChange, queryDefinition);
        });
    }
    static search(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.search(datefieldchange_1.DateFieldChange, queryDefinition, subject);
    }
    static searchOne(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.searchOne(datefieldchange_1.DateFieldChange, queryDefinition, subject);
    }
    static create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.create(datefieldchange_1.DateFieldChange, entity);
        });
    }
    static update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.update(datefieldchange_1.DateFieldChange, entity);
        });
    }
    static delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.delete(datefieldchange_1.DateFieldChange, entity);
        });
    }
    static save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.save(datefieldchange_1.DateFieldChange, entity);
        });
    }
}
QDateFieldChange.from = new QDateFieldChange(datefieldchange_1.DateFieldChange, 'DateFieldChange', 'DateFieldChange');
exports.QDateFieldChange = QDateFieldChange;
PH_1.PH.addQEntity(datefieldchange_1.DateFieldChange, QDateFieldChange.from);
//# sourceMappingURL=datefieldchange.js.map