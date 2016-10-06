"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const querydsl_typescript_1 = require("querydsl-typescript");
const booleanfieldchange_1 = require("../model/booleanfieldchange");
const abstractfieldchange_1 = require("./abstractfieldchange");
const PH_1 = require("../../config/PH");
// Entity Query Implementation
class QBooleanFieldChange extends abstractfieldchange_1.QAbstractFieldChange {
    // Relations
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.newValue = new querydsl_typescript_1.QBooleanField(this, QBooleanFieldChange, 'BooleanFieldChange', 'newValue');
        this.oldValue = new querydsl_typescript_1.QBooleanField(this, QBooleanFieldChange, 'BooleanFieldChange', 'oldValue');
    }
    toJSON() {
        throw 'Not Implemented';
    }
    static find(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.find(booleanfieldchange_1.BooleanFieldChange, queryDefinition);
        });
    }
    static findOne(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.findOne(booleanfieldchange_1.BooleanFieldChange, queryDefinition);
        });
    }
    static search(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.search(booleanfieldchange_1.BooleanFieldChange, queryDefinition, subject);
    }
    static searchOne(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.searchOne(booleanfieldchange_1.BooleanFieldChange, queryDefinition, subject);
    }
    static insert(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.insert(booleanfieldchange_1.BooleanFieldChange, entity);
        });
    }
    static create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.create(booleanfieldchange_1.BooleanFieldChange, entity);
        });
    }
    static update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.update(booleanfieldchange_1.BooleanFieldChange, entity);
        });
    }
    static updateWhere(phRawUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.updateWhere(booleanfieldchange_1.BooleanFieldChange, phRawUpdate);
        });
    }
    static delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.delete(booleanfieldchange_1.BooleanFieldChange, entity);
        });
    }
    static deleteWhere(phRawDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.deleteWhere(booleanfieldchange_1.BooleanFieldChange, phRawDelete);
        });
    }
    static save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.save(booleanfieldchange_1.BooleanFieldChange, entity);
        });
    }
}
exports.QBooleanFieldChange = QBooleanFieldChange;
QBooleanFieldChange.from = new QBooleanFieldChange(booleanfieldchange_1.BooleanFieldChange, 'BooleanFieldChange', 'BooleanFieldChange');
PH_1.PH.addQEntity(booleanfieldchange_1.BooleanFieldChange, QBooleanFieldChange.from);
//# sourceMappingURL=booleanfieldchange.js.map