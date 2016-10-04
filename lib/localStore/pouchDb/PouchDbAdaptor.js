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
const DateUtils_1 = require("../../shared/DateUtils");
const PH_1 = require("../../config/PH");
const Subject_1 = require("rxjs/Subject");
const PlatformUtils_1 = require("../../shared/PlatformUtils");
const PHMetadataUtils_1 = require("../../core/metadata/PHMetadataUtils");
const LocalStoreApi_1 = require("../LocalStoreApi");
const PouchDB = require('pouchdb');
/**
 * Created by Papa on 5/28/2016.
 */
class PouchDbAdaptor {
    constructor() {
        this.type = LocalStoreApi_1.LocalStoreType.POUCH_DB;
    }
    wrapInTransaction(callback) {
        throw `Not implemented`;
    }
    initialize(setupInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let dbName = setupInfo.name;
            var localDB = PouchDB(dbName);
            return yield localDB.info().then((dbInfo) => {
                console.log(dbInfo);
            });
        });
    }
    create(entityName, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let nowTimeStamp = DateUtils_1.DateUtils.getNowTimeStamp();
            let macAddress = PlatformUtils_1.PlatformUtils.getDeviceAddress();
            let proxy = entity;
            let record = entity;
            record._id = `${entityName}_${nowTimeStamp}_${macAddress}`;
            let updateRecord = yield this.localDB.put(record);
            record._rev = updateRecord.rev;
            return record;
        });
    }
    delete(entityName, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = entity;
            let deleteRecord = yield this.localDB.remove(record);
            return entity;
        });
    }
    deleteWhere(entityName, phSqlDelete, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            throw `Not Implemented`;
        });
    }
    searchOne(entityName, phQuery, subject = new Subject_1.Subject()) {
        this.findOne(entityName, phQuery).then((entity) => {
            subject.next(entity);
        });
        return subject;
    }
    search(entityName, phQuery, subject = new Subject_1.Subject()) {
        this.find(entityName, phQuery).then((entities) => {
            subject.next(entities);
        });
        return subject;
    }
    find(entityName, phQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonQuery = phQuery.toJSON();
            let pouchDbQuery = new querydsl_typescript_1.PouchDbGraphQuery(phQuery.qEntity.__entityName__, phQuery.qEntity.__entityName__, phQuery.entitiesRelationPropertyMap, phQuery.entitiesPropertyTypeMap, jsonQuery);
            return this.processQuery(entityName, pouchDbQuery);
        });
    }
    processQuery(entityName, pouchDbQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            pouchDbQuery.parseAll();
            let findResult = yield this.localDB.find({
                selector: pouchDbQuery.selector,
                fields: pouchDbQuery.fields
            });
            let qEntity = PHMetadataUtils_1.NameMetadataUtils.getQEntity(entityName);
            let entityMetadata = qEntity.__entityConstructor__;
            let primaryKey = entityMetadata.idProperty;
            let initialResults = findResult.docs.map((doc) => {
                let entity = new qEntity.__entityConstructor__();
                pouchDbQuery.fields.forEach((fieldName) => {
                    entity[fieldName] = doc[fieldName];
                });
                return entity;
            });
            let childQueries = pouchDbQuery.childQueries;
            if (Object.keys(childQueries).length === 0) {
                return initialResults;
            }
            for (let propertyName in childQueries) {
                let childQuery = childQueries[propertyName];
                let objectSelector = childQuery.selector['$and'];
                let relationRecord = PH_1.PH.entitiesRelationPropertyMap[entityName][propertyName];
                let childEntityConstructor = PH_1.PH.qEntityMap[relationRecord.entityName].__entityConstructor__;
                switch (relationRecord.relationType) {
                    case querydsl_typescript_1.RelationType.MANY_TO_ONE:
                        this.loadOneToManyRelation(childQuery, entityName, initialResults, propertyName);
                        break;
                    case querydsl_typescript_1.RelationType.ONE_TO_MANY:
                        this.loadOneToManyRelation(childQuery, entityName, initialResults, propertyName);
                        break;
                }
            }
            return null;
        });
    }
    loadManyToOneRelation(childQuery, entityName, parentResults, propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectSelector = childQuery.selector['$and'];
            let relationRecord = PH_1.PH.entitiesRelationPropertyMap[entityName][propertyName];
            let childEntityConstructor = PH_1.PH.qEntityMap[relationRecord.entityName].__entityConstructor__;
            let parentEntitiesByForeignKey = {};
            let foreignKeys = parentResults.map((entity) => {
                let foreignKeyValue = entity[relationRecord.propertyName];
                let parentEntitiesForForeignKey = parentEntitiesByForeignKey[foreignKeyValue];
                if (!parentEntitiesForForeignKey) {
                    parentEntitiesForForeignKey = [];
                    parentEntitiesByForeignKey[foreignKeyValue] = parentEntitiesForForeignKey;
                }
                parentEntitiesForForeignKey.push(entity);
                return foreignKeyValue;
            });
            objectSelector['_id'] = {
                '$in': foreignKeys
            };
            let oneChildEntities = yield this.processQuery(entityName, childQuery);
            oneChildEntities.forEach((childEntity) => {
                let oneChildKey = childEntity._id;
                let parentEntitiesForForeignKey = parentEntitiesByForeignKey[oneChildKey];
                parentEntitiesForForeignKey.forEach((parentEntity) => {
                    parentEntity[propertyName] = childEntity;
                });
            });
            return oneChildEntities;
        });
    }
    loadOneToManyRelation(childQuery, entityName, parentResults, propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectSelector = childQuery.selector['$and'];
            let relationRecord = PH_1.PH.entitiesRelationPropertyMap[entityName][propertyName];
            let childEntityConstructor = PH_1.PH.qEntityMap[relationRecord.entityName].__entityConstructor__;
            let oneToManyElements = childEntityConstructor.oneToManyMap[propertyName];
            let mappedByPropertyName = oneToManyElements.mappedBy;
            let parentEntitiesByPrimaryKey = {};
            let ids = parentResults.map((entity) => {
                let primaryKey = entity._id;
                parentEntitiesByPrimaryKey[primaryKey] = entity;
                entity[propertyName] = [];
                return entity._id;
            });
            objectSelector[mappedByPropertyName] = {
                '$in': ids
            };
            let manyChildEntities = yield this.processQuery(entityName, childQuery);
            manyChildEntities.forEach((childEntity) => {
                let manyChildForeignKey = childEntity[mappedByPropertyName];
                let oneChildKey = childEntity._id;
                let parentEntity = parentEntitiesByPrimaryKey[manyChildForeignKey];
                parentEntity[propertyName].push(childEntity);
            });
            return manyChildEntities;
        });
    }
    findOne(entityName, phQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultList = yield this.find(entityName, phQuery);
            if (resultList.length > 1) {
                throw `Found more than 1 entity for query (${resultList.length}).`;
            }
            if (resultList.length === 1) {
                return resultList[0];
            }
            return null;
        });
    }
    save(entityName, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = entity;
            if (record._id && record._rev) {
                return yield this.update(entityName, entity);
            }
            else {
                return yield this.create(entityName, entity);
            }
        });
    }
    update(entityName, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = entity;
            record.lastUpdateTime = new Date();
            let updateRecord = yield this.localDB.put(record);
            record._rev = updateRecord.rev;
            return record;
        });
    }
    updateWhere(entityName, phSqlUpdate, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            throw `Not Implemented`;
        });
    }
}
exports.PouchDbAdaptor = PouchDbAdaptor;
//# sourceMappingURL=PouchDbAdaptor.js.map