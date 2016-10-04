"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const SqlAdaptor_1 = require("../SqlAdaptor");
const ChangeGroup_1 = require("../../changeList/model/ChangeGroup");
/**
 * Created by Papa on 9/20/2016.
 */
class StubSqlAdaptor extends SqlAdaptor_1.SqlAdaptor {
    constructor() {
        super(...arguments);
        this.currentTransaction = false;
    }
    initialize(setupInfo) {
        return null;
    }
    wrapInTransaction(callback) {
        let result;
        if (this.currentTransaction) {
            result = callback();
            if (!(result instanceof Promise)) {
                throw `A method with @Transactional decorator must return a promise`;
            }
            return result;
        }
        return new Promise((resolve, reject) => {
            this.currentTransaction = true;
            this.currentChangeGroup = ChangeGroup_1.ChangeGroup.getNewChangeGroup('Transactional', this.idGenerator);
            result = callback();
            if (!(result instanceof Promise)) {
                throw `A method with @Transactional decorator must return a promise`;
            }
            result.then((value) => {
                this.currentTransaction = null;
                this.currentChangeGroup = null;
                resolve(value);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    getDialect() {
        return null;
    }
    findNative(sqlQuery, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            throw `Unexpected find call`;
        });
    }
    createNative(qEntity, columnNames, values, cascadeRecords, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            if (cascadeRecords.length) {
                for (let i = 0; i < cascadeRecords.length; i++) {
                    let cascadeRecord = cascadeRecords[i];
                    yield this.create(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
                }
            }
        });
    }
    deleteNative(qEntity, entity, idValue, cascadeRecords, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityMetadata = qEntity.__entityConstructor__;
            if (cascadeRecords.length) {
                for (let i = 0; i < cascadeRecords.length; i++) {
                    let cascadeRecord = cascadeRecords[i];
                    cascadeRecord.manyEntity[cascadeRecord.mappedBy] = entity;
                    yield this.delete(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
                }
            }
            let entityChange = changeGroup.addNewDeleteEntityChange(qEntity.__entityName__, entity, entityMetadata.idProperty);
            return entityChange;
        });
    }
    deleteWhereNative(sqlStringDelete, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityChange = changeGroup.addNewDeleteWhereEntityChange(sqlStringDelete.qEntity.__entityName__, sqlStringDelete.phJsonDelete);
            return entityChange;
        });
    }
    updateNative(qEntity, columnNames, values, idProperty, idValue, cascadeRecords, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            if (cascadeRecords.length) {
                for (let i = 0; i < cascadeRecords.length; i++) {
                    let cascadeRecord = cascadeRecords[i];
                    switch (cascadeRecord.cascadeType) {
                        case "create":
                            yield this.create(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
                            break;
                        case "update":
                            yield this.update(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
                            break;
                        case "remove":
                            throw `Cascading removes from an update are not supported`;
                    }
                }
            }
        });
    }
    updateWhereNative(sqlStringUpdate, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityChange = changeGroup.addNewUpdateWhereEntityChange(sqlStringUpdate.qEntity.__entityName__, sqlStringUpdate.phJsonUpdate);
            return entityChange;
        });
    }
    search(entityName, phQuery, subject) {
        throw `Unexpected search call`;
    }
    searchOne(entityName, phQuery, subject) {
        throw `Unexpected searchOne call`;
    }
    warn(message) {
        console.log(message);
    }
}
exports.StubSqlAdaptor = StubSqlAdaptor;
//# sourceMappingURL=StubSqlAdaptor.js.map