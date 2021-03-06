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
const numberfieldchange_1 = require("../model/numberfieldchange");
const abstractfieldchange_1 = require("./abstractfieldchange");
const PH_1 = require("../../config/PH");
// Entity Query Implementation
class QNumberFieldChange extends abstractfieldchange_1.QAbstractFieldChange {
    // Relations
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.newValue = new querydsl_typescript_1.QNumberField(this, QNumberFieldChange, 'NumberFieldChange', 'newValue');
        this.oldValue = new querydsl_typescript_1.QNumberField(this, QNumberFieldChange, 'NumberFieldChange', 'oldValue');
    }
    toJSON() {
        throw 'Not Implemented';
    }
    static find(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.find(numberfieldchange_1.NumberFieldChange, queryDefinition);
        });
    }
    static findOne(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.findOne(numberfieldchange_1.NumberFieldChange, queryDefinition);
        });
    }
    static search(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.search(numberfieldchange_1.NumberFieldChange, queryDefinition, subject);
    }
    static searchOne(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.searchOne(numberfieldchange_1.NumberFieldChange, queryDefinition, subject);
    }
    static insert(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.insert(numberfieldchange_1.NumberFieldChange, entity);
        });
    }
    static create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.create(numberfieldchange_1.NumberFieldChange, entity);
        });
    }
    static update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.update(numberfieldchange_1.NumberFieldChange, entity);
        });
    }
    static updateWhere(phRawUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.updateWhere(numberfieldchange_1.NumberFieldChange, phRawUpdate);
        });
    }
    static delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.delete(numberfieldchange_1.NumberFieldChange, entity);
        });
    }
    static deleteWhere(phRawDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.deleteWhere(numberfieldchange_1.NumberFieldChange, phRawDelete);
        });
    }
    static save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.save(numberfieldchange_1.NumberFieldChange, entity);
        });
    }
}
exports.QNumberFieldChange = QNumberFieldChange;
QNumberFieldChange.from = new QNumberFieldChange(numberfieldchange_1.NumberFieldChange, 'NumberFieldChange', 'NumberFieldChange');
PH_1.PH.addQEntity(numberfieldchange_1.NumberFieldChange, QNumberFieldChange.from);
//# sourceMappingURL=numberfieldchange.js.map