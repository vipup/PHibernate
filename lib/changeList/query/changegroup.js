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
const changegroup_1 = require("../model/changegroup");
const deltarecord_1 = require("./deltarecord");
const PH_1 = require("../../config/PH");
const entitychange_1 = require("../model/entitychange");
const entitychange_2 = require("./entitychange");
// Entity Query Implementation
class QChangeGroup extends deltarecord_1.QDeltaRecord {
    constructor(entityConstructor, entityName, alias) {
        super(entityConstructor, entityName, alias);
        // Fields
        this.type = new querydsl_typescript_1.QStringField(this, QChangeGroup, 'ChangeGroup', 'type');
        this.numberOfEntitiesInGroup = new querydsl_typescript_1.QNumberField(this, QChangeGroup, 'ChangeGroup', 'numberOfEntitiesInGroup');
        this.groupIndexInMillisecond = new querydsl_typescript_1.QNumberField(this, QChangeGroup, 'ChangeGroup', 'groupIndexInMillisecond');
        this.syncStatus = new querydsl_typescript_1.QNumberField(this, QChangeGroup, 'ChangeGroup', 'syncStatus');
        // Relations
        this.entityChanges = new querydsl_typescript_1.QRelation(this, QChangeGroup, querydsl_typescript_1.RelationType.ONE_TO_MANY, 'EntityChange', 'entityChanges', entitychange_1.EntityChange, entitychange_2.QEntityChange);
    }
    toJSON() {
        throw 'Not Implemented';
    }
    static find(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.find(changegroup_1.ChangeGroup, queryDefinition);
        });
    }
    static findOne(queryDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.findOne(changegroup_1.ChangeGroup, queryDefinition);
        });
    }
    static search(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.search(changegroup_1.ChangeGroup, queryDefinition, subject);
    }
    static searchOne(entityClass, queryDefinition, subject) {
        return PH_1.PH.entityManager.searchOne(changegroup_1.ChangeGroup, queryDefinition, subject);
    }
    static create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.create(changegroup_1.ChangeGroup, entity);
        });
    }
    static update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.update(changegroup_1.ChangeGroup, entity);
        });
    }
    static delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.delete(changegroup_1.ChangeGroup, entity);
        });
    }
    static save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PH_1.PH.entityManager.save(changegroup_1.ChangeGroup, entity);
        });
    }
}
exports.QChangeGroup = QChangeGroup;
QChangeGroup.from = new QChangeGroup(changegroup_1.ChangeGroup, 'ChangeGroup', 'ChangeGroup');
PH_1.PH.addQEntity(changegroup_1.ChangeGroup, QChangeGroup.from);
//# sourceMappingURL=changegroup.js.map