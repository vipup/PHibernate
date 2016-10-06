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
const stringfieldchange_1 = require("../model/stringfieldchange");
const abstractfieldchange_1 = require("./abstractfieldchange");
const PH_1 = require("../../config/PH");
// Entity Query Implementation
class QStringFieldChange extends abstractfieldchange_1.QAbstractFieldChange {
    // Relations
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.newValue = new querydsl_typescript_1.QStringField(this, QStringFieldChange, 'StringFieldChange', 'newValue');
        this.oldValue = new querydsl_typescript_1.QStringField(this, QStringFieldChange, 'StringFieldChange', 'oldValue');
    }
    toJSON() {
        throw 'Not Implemented';
    }
    static find(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.find(stringfieldchange_1.StringFieldChange, queryDefinition);
        });
    }
    static findOne(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.findOne(stringfieldchange_1.StringFieldChange, queryDefinition);
        });
    }
    static search(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.search(stringfieldchange_1.StringFieldChange, queryDefinition, subject);
    }
    static searchOne(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.searchOne(stringfieldchange_1.StringFieldChange, queryDefinition, subject);
    }
    static insert(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.insert(stringfieldchange_1.StringFieldChange, entity);
        });
    }
    static create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.create(stringfieldchange_1.StringFieldChange, entity);
        });
    }
    static update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.update(stringfieldchange_1.StringFieldChange, entity);
        });
    }
    static updateWhere(phRawUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.updateWhere(stringfieldchange_1.StringFieldChange, phRawUpdate);
        });
    }
    static delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.delete(stringfieldchange_1.StringFieldChange, entity);
        });
    }
    static deleteWhere(phRawDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.deleteWhere(stringfieldchange_1.StringFieldChange, phRawDelete);
        });
    }
    static save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.save(stringfieldchange_1.StringFieldChange, entity);
        });
    }
}
exports.QStringFieldChange = QStringFieldChange;
QStringFieldChange.from = new QStringFieldChange(stringfieldchange_1.StringFieldChange, 'StringFieldChange', 'StringFieldChange');
PH_1.PH.addQEntity(stringfieldchange_1.StringFieldChange, QStringFieldChange.from);
//# sourceMappingURL=stringfieldchange.js.map