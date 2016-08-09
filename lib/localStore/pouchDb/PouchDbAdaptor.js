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
const EntityUtils_1 = require("../../shared/EntityUtils");
const DateUtils_1 = require("../../shared/DateUtils");
const PH_1 = require("../../config/PH");
const Subject_1 = require('rxjs/Subject');
const decorators_1 = require("../../core/metadata/decorators");
const PlatformUtils_1 = require("../../shared/PlatformUtils");
const PouchDB = require('pouchdb');
/**
 * Created by Papa on 5/28/2016.
 */
class PouchDbAdaptor {
    initialize(setupInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let dbName = setupInfo.name;
            var localDB = PouchDB(dbName);
            return yield localDB.info().then((dbInfo) => {
                console.log(dbInfo);
            });
        });
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let className = EntityUtils_1.EntityUtils.getObjectClassName(entity);
            let nowTimeStamp = DateUtils_1.DateUtils.getNowTimeStamp();
            let macAddress = PlatformUtils_1.PlatformUtils.getMacAddress();
            let proxy = entity;
            let record = entity;
            record._id = `${className}_${nowTimeStamp}_${macAddress}`;
            let updateRecord = yield this.localDB.put(record);
            record._rev = updateRecord.rev;
            return record;
        });
    }
    delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = entity;
            let deleteRecord = yield this.localDB.remove(record);
            return entity;
        });
    }
    searchOne(entityClass, phQuery, subject = new Subject_1.Subject()) {
        this.findOne(entityClass, phQuery).then((entity) => {
            subject.next(entity);
        });
        return subject;
    }
    search(entityClass, phQuery, subject = new Subject_1.Subject()) {
        this.find(entityClass, phQuery).then((entities) => {
            subject.next(entities);
        });
        return subject;
    }
    find(entityConstructor, phQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonQuery = phQuery.toJSON();
            let pouchDbQuery = new querydsl_typescript_1.PouchDbQuery(phQuery.qEntity.__entityName__, phQuery.entitiesRelationPropertyMap, phQuery.entitiesPropertyTypeMap, jsonQuery);
            return this.processQuery(entityConstructor, pouchDbQuery);
        });
    }
    processQuery(entityConstructor, pouchDbQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            pouchDbQuery.parse();
            let findResult = yield this.localDB.find({
                selector: pouchDbQuery.selector,
                fields: pouchDbQuery.fields
            });
            let primaryKey = entityConstructor[decorators_1.PH_PRIMARY_KEY];
            let initialResults = findResult.docs.map((doc) => {
                let entity = new entityConstructor();
                pouchDbQuery.fields.forEach((fieldName) => {
                    entity[fieldName] = doc[fieldName];
                });
                return entity;
            });
            let childQueries = pouchDbQuery.childQueries;
            if (Object.keys(childQueries).length === 0) {
                return initialResults;
            }
            let entityName = EntityUtils_1.EntityUtils.getClassName(entityConstructor);
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
            let oneChildEntities = yield this.processQuery(childEntityConstructor, childQuery);
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
            let oneToManyElements = relationRecord.decoratorElements[decorators_1.PH_ONE_TO_MANY][propertyName];
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
            let manyChildEntities = yield this.processQuery(childEntityConstructor, childQuery);
            manyChildEntities.forEach((childEntity) => {
                let manyChildForeignKey = childEntity[mappedByPropertyName];
                let oneChildKey = childEntity._id;
                let parentEntity = parentEntitiesByPrimaryKey[manyChildForeignKey];
                parentEntity[propertyName].push(childEntity);
            });
            return manyChildEntities;
        });
    }
    findOne(entityClass, phQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultList = yield this.find(entityClass, phQuery);
            if (resultList.length > 1) {
                throw `Found more than 1 entity for query (${resultList.length}).`;
            }
            if (resultList.length === 1) {
                return resultList[0];
            }
            return null;
        });
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = entity;
            if (record._id && record._rev) {
                return yield this.update(entity);
            }
            else {
                return yield this.create(entity);
            }
        });
    }
    update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = entity;
            record.lastUpdateTime = new Date();
            let updateRecord = yield this.localDB.put(record);
            record._rev = updateRecord.rev;
            return record;
        });
    }
}
exports.PouchDbAdaptor = PouchDbAdaptor;
//# sourceMappingURL=PouchDbAdaptor.js.map