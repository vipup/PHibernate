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
const entitywherechange_1 = require("../model/entitywherechange");
const abstractentitychange_1 = require("./abstractentitychange");
const PH_1 = require("../../config/PH");
// Entity Query Implementation
class QEntityWhereChange extends abstractentitychange_1.QAbstractEntityChange {
    // Relations
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.numberOfAffectedRecords = new querydsl_typescript_1.QNumberField(this, QEntityWhereChange, 'EntityWhereChange', 'numberOfAffectedRecords');
        this.queryJson = new querydsl_typescript_1.QStringField(this, QEntityWhereChange, 'EntityWhereChange', 'queryJson');
    }
    toJSON() {
        throw 'Not Implemented';
    }
    static find(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.find(entitywherechange_1.EntityWhereChange, queryDefinition);
        });
    }
    static findOne(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.findOne(entitywherechange_1.EntityWhereChange, queryDefinition);
        });
    }
    static search(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.search(entitywherechange_1.EntityWhereChange, queryDefinition, subject);
    }
    static searchOne(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.searchOne(entitywherechange_1.EntityWhereChange, queryDefinition, subject);
    }
    static insert(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.insert(entitywherechange_1.EntityWhereChange, entity);
        });
    }
    static create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.create(entitywherechange_1.EntityWhereChange, entity);
        });
    }
    static update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.update(entitywherechange_1.EntityWhereChange, entity);
        });
    }
    static updateWhere(phRawUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.updateWhere(entitywherechange_1.EntityWhereChange, phRawUpdate);
        });
    }
    static delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.delete(entitywherechange_1.EntityWhereChange, entity);
        });
    }
    static deleteWhere(phRawDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.deleteWhere(entitywherechange_1.EntityWhereChange, phRawDelete);
        });
    }
    static save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.save(entitywherechange_1.EntityWhereChange, entity);
        });
    }
}
exports.QEntityWhereChange = QEntityWhereChange;
QEntityWhereChange.from = new QEntityWhereChange(entitywherechange_1.EntityWhereChange, 'EntityWhereChange', 'EntityWhereChange');
PH_1.PH.addQEntity(entitywherechange_1.EntityWhereChange, QEntityWhereChange.from);
//# sourceMappingURL=entitywherechange.js.map