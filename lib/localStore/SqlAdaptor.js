"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const PH_1 = require("../config/PH");
const querydsl_typescript_1 = require("querydsl-typescript");
const PHMetadataUtils_1 = require("../core/metadata/PHMetadataUtils");
const rxjs_1 = require("rxjs");
const IdGenerator_1 = require("./IdGenerator");
const UpdateCache_1 = require("../core/repository/UpdateCache");
class SqlAdaptor {
    constructor(idGeneration) {
        this.idGenerator = IdGenerator_1.getIdGenerator(idGeneration);
    }
    create(entityName, entity) {
        return __awaiter(this, void 0, Promise, function* () {
            let qEntity = PH_1.PH.qEntityMap[entityName];
            let entityMetadata = qEntity.__entityConstructor__;
            let entityRelationMap = PH_1.PH.entitiesRelationPropertyMap[entityName];
            if (!entityMetadata.idProperty) {
                throw `@Id is not defined for entity: ${entityName}`;
            }
            if (entity[entityMetadata.idProperty]) {
                throw `Cannot create entity: ${entityName}, id is already defined to be: ${entityMetadata.idProperty}`;
            }
            entity[entityMetadata.idProperty] = this.idGenerator.generateId(entityMetadata);
            let columnNames = [];
            let values = [];
            let cascadeRecords = [];
            for (let propertyName in entity) {
                let columnName = PHMetadataUtils_1.PHMetadataUtils.getPropertyColumnName(propertyName, qEntity);
                if (columnName) {
                    columnNames.push(columnName);
                    values.push(entity[propertyName]);
                    continue;
                }
                let nonPropertyValue = entity[propertyName];
                // If there is no value then it doesn't have to be created
                if (!nonPropertyValue && nonPropertyValue !== '' && nonPropertyValue !== 0) {
                    continue;
                }
                columnName = PHMetadataUtils_1.PHMetadataUtils.getJoinColumnName(propertyName, qEntity);
                // if there is no entity data on in, don't process it (transient field)
                if (!columnName) {
                    return;
                }
                // If it's not an object/array
                if (typeof nonPropertyValue != 'object' || nonPropertyValue instanceof Date) {
                    throw `Unexpected value in relation property: ${propertyName}, of entity ${entityName}`;
                }
                let entityRelation = entityRelationMap[propertyName];
                switch (entityRelation.relationType) {
                    case querydsl_typescript_1.RelationType.MANY_TO_ONE:
                        if (nonPropertyValue instanceof Array) {
                            throw `@ManyToOne relation cannot be an array`;
                        }
                        // get the parent object's id
                        let parentObjectIdValue = PHMetadataUtils_1.NameMetadataUtils.getIdValue(entityRelation.entityName, nonPropertyValue);
                        if (!parentObjectIdValue) {
                            throw `Parent object's (${entityRelation.entityName}) @Id value is missing `;
                        }
                        columnNames.push(columnName);
                        values.push(parentObjectIdValue);
                        // Cascading on manyToOne is not currently implemented, nothing else needs to be done
                        continue;
                    case querydsl_typescript_1.RelationType.ONE_TO_MANY:
                        if (!(nonPropertyValue instanceof Array)) {
                            throw `@OneToMany relation must be an array`;
                        }
                        let oneToManyConfig = PHMetadataUtils_1.PHMetadataUtils.getOneToManyConfig(propertyName, qEntity);
                        let cascadeType = oneToManyConfig.cascade;
                        switch (cascadeType) {
                            case querydsl_typescript_1.CascadeType.ALL:
                            case querydsl_typescript_1.CascadeType.PERSIST:
                                // Save for cascade operation
                                for (let manyEntity in nonPropertyValue) {
                                    cascadeRecords.push({
                                        entityName: entityRelation.entityName,
                                        mappedBy: oneToManyConfig.mappedBy,
                                        manyEntity: manyEntity,
                                        cascadeType: 'create'
                                    });
                                }
                        }
                        break;
                }
            }
            yield this.createNative(qEntity, columnNames, values, cascadeRecords);
        });
    }
    delete(entityName, entity, startNewTransaction = false) {
        return __awaiter(this, void 0, Promise, function* () {
            let qEntity = PH_1.PH.qEntityMap[entityName];
            let entityMetadata = qEntity.__entityConstructor__;
            let entityRelationMap = PH_1.PH.entitiesRelationPropertyMap[entityName];
            if (!entityMetadata.idProperty) {
                throw `@Id is not defined for entity: ${entityName}`;
            }
            let idValue = entity[entityMetadata.idProperty];
            if (!idValue) {
                throw `Cannot delete entity: ${entityName}, id is not set.`;
            }
            let cascadeRecords = [];
            let removalRecords = [];
            for (let propertyName in entity) {
                let entityRelation = entityRelationMap[propertyName];
                // Only check relationships
                if (!entityRelation) {
                    continue;
                }
                let nonPropertyValue = entity[propertyName];
                // skip blank relations
                if (!nonPropertyValue) {
                    continue;
                }
                // If it's not an object/array it's invalid
                if (typeof nonPropertyValue != 'object' || nonPropertyValue instanceof Date) {
                    throw `Entity relation ${entityName}.${propertyName} is not an object or an array`;
                }
                switch (entityRelation.relationType) {
                    case querydsl_typescript_1.RelationType.MANY_TO_ONE:
                        if (nonPropertyValue instanceof Array) {
                            throw `@ManyToOne relation cannot be an array`;
                        }
                        // get the parent object's related OneToMany
                        let parentObjectIdValue = PHMetadataUtils_1.NameMetadataUtils.getIdValue(entityRelation.entityName, nonPropertyValue);
                        let relatedOneToMany = PHMetadataUtils_1.NameMetadataUtils.getRelatedOneToManyConfig(propertyName, entityRelation.entityName);
                        if (!relatedOneToMany || !relatedOneToMany.config.orphanRemoval) {
                            continue;
                        }
                        let relatedObject = entity[propertyName];
                        let relatedObjectManyReference = relatedObject[relatedOneToMany.propertyName];
                        for (let i = 0; i < relatedObjectManyReference.length; i++) {
                            if (relatedObjectManyReference[i] === entity) {
                                removalRecords.push({
                                    array: relatedObjectManyReference,
                                    index: i
                                });
                                break;
                            }
                        }
                        // Cascading on manyToOne is not currently implemented, nothing else needs to be done
                        continue;
                    case querydsl_typescript_1.RelationType.ONE_TO_MANY:
                        if (!(nonPropertyValue instanceof Array)) {
                            throw `@OneToMany relation must be an array`;
                        }
                        let oneToManyConfig = PHMetadataUtils_1.PHMetadataUtils.getOneToManyConfig(propertyName, qEntity);
                        let cascadeType = oneToManyConfig.cascade;
                        switch (cascadeType) {
                            case querydsl_typescript_1.CascadeType.ALL:
                            case querydsl_typescript_1.CascadeType.REMOVE:
                                // Save for cascade operation
                                for (let manyEntity in nonPropertyValue) {
                                    cascadeRecords.push({
                                        entityName: entityRelation.entityName,
                                        mappedBy: oneToManyConfig.mappedBy,
                                        manyEntity: manyEntity,
                                        cascadeType: 'remove'
                                    });
                                }
                        }
                        break;
                }
            }
            yield this.deleteNative(qEntity, entity, idValue, cascadeRecords, startNewTransaction);
            removalRecords.forEach((removalRecord) => {
                // Remove the deleted object from the related @ManyToOne objects array reference
                removalRecord.array.splice(removalRecord.index, 1);
            });
        });
    }
    update(entityName, entity) {
        return __awaiter(this, void 0, Promise, function* () {
            /**
             * On an update operation, can a nested create contain an update?
             * Via:
             *  OneToMany:
             *    Yes, if the child entity is itself in the update cache
             *  ManyToOne:
             *    Cascades do not travel across ManyToOne
             */
            let qEntity = PH_1.PH.qEntityMap[entityName];
            let entityMetadata = qEntity.__entityConstructor__;
            let entityRelationMap = PH_1.PH.entitiesRelationPropertyMap[entityName];
            if (!entityMetadata.idProperty) {
                throw `@Id is not defined for entity: ${entityName}`;
            }
            let idValue = entity[entityMetadata.idProperty];
            if (!idValue) {
                throw `Cannot update entity: ${entityName}, id is not set.`;
            }
            let updateCache = UpdateCache_1.UpdateCache.getEntityUpdateCache(entityName, entity);
            let columnNames = [];
            let values = [];
            let cascadeRecords = [];
            for (let propertyName in entity) {
                let columnName = PHMetadataUtils_1.PHMetadataUtils.getPropertyColumnName(propertyName, qEntity);
                // If the property is not a transient field and not a relation
                if (columnName) {
                    let updatedValue = entity[propertyName];
                    if (typeof updatedValue === 'object' && updatedValue) {
                        if (!(qEntity[propertyName] instanceof querydsl_typescript_1.QDateField)) {
                            throw `Unexpected object type in property: ${propertyName}, of entity: ${entityName}`;
                        }
                        if (!(updatedValue instanceof Date)) {
                            throw `Unexpected object in property: ${propertyName}, of entity: ${entityName}`;
                        }
                    }
                    if (updateCache) {
                        let originalValue = updateCache[propertyName];
                        if (!UpdateCache_1.UpdateCache.valuesEqualIgnoreObjects(originalValue, updatedValue)) {
                            columnNames.push(columnName);
                            values.push(entity[propertyName]);
                        }
                    }
                    else {
                        columnNames.push(columnName);
                        values.push(entity[propertyName]);
                    }
                    continue;
                }
                let nonPropertyValue = entity[propertyName];
                columnName = PHMetadataUtils_1.PHMetadataUtils.getJoinColumnName(propertyName, qEntity);
                // if there is no entity data on in, don't process it (transient field)
                if (!columnName) {
                    return;
                }
                // If it's not an object/array
                if (typeof nonPropertyValue != 'object' || nonPropertyValue instanceof Date) {
                    throw `Unexpected value in relation property: ${propertyName}, of entity ${entityName}`;
                }
                let entityRelation = entityRelationMap[propertyName];
                switch (entityRelation.relationType) {
                    case querydsl_typescript_1.RelationType.MANY_TO_ONE:
                        if (nonPropertyValue instanceof Array) {
                            throw `@ManyToOne relation cannot be an array`;
                        }
                        // get the parent object's id
                        let parentObjectIdValue = PHMetadataUtils_1.NameMetadataUtils.getIdValue(entityRelation.entityName, nonPropertyValue);
                        if (!parentObjectIdValue) {
                            throw `Parent object's (${entityRelation.entityName}) @Id value is missing `;
                        }
                        columnNames.push(columnName);
                        values.push(parentObjectIdValue);
                        // Cascading on manyToOne is not currently implemented, nothing else needs to be done
                        continue;
                    case querydsl_typescript_1.RelationType.ONE_TO_MANY:
                        if (!(nonPropertyValue instanceof Array)) {
                            throw `@OneToMany relation must be an array`;
                        }
                        let oneToManyConfig = PHMetadataUtils_1.PHMetadataUtils.getOneToManyConfig(propertyName, qEntity);
                        let cascadeType = oneToManyConfig.cascade;
                        switch (cascadeType) {
                            case querydsl_typescript_1.CascadeType.ALL:
                            case querydsl_typescript_1.CascadeType.MERGE:
                                // Save for cascade operation
                                for (let manyEntity in nonPropertyValue) {
                                    let parentObjectIdValue = PHMetadataUtils_1.NameMetadataUtils.getIdValue(entityRelation.entityName, manyEntity);
                                    // If the child record does not exist, cascade a create operation
                                    if (!parentObjectIdValue) {
                                        cascadeRecords.push({
                                            entityName: entityRelation.entityName,
                                            mappedBy: oneToManyConfig.mappedBy,
                                            manyEntity: manyEntity,
                                            cascadeType: 'create'
                                        });
                                    }
                                    else {
                                        let updateCache = UpdateCache_1.UpdateCache.getEntityUpdateCache(entityName, entity);
                                        // Cannot cascade update operations without an update cache
                                        if (!updateCache) {
                                            continue;
                                        }
                                        cascadeRecords.push({
                                            entityName: entityRelation.entityName,
                                            mappedBy: oneToManyConfig.mappedBy,
                                            manyEntity: manyEntity,
                                            cascadeType: 'update'
                                        });
                                    }
                                }
                        }
                        break;
                }
            }
            yield this.updateNative(qEntity, columnNames, values, entityMetadata.idProperty, idValue, cascadeRecords);
            return null;
        });
    }
    find(entityName, phSqlQuery) {
        return __awaiter(this, void 0, Promise, function* () {
            let qEntity = PH_1.PH.qEntityMap[entityName];
            let query = new querydsl_typescript_1.SQLStringQuery(phSqlQuery.toSQL(), qEntity, PH_1.PH.qEntityMap, PH_1.PH.entitiesRelationPropertyMap, PH_1.PH.entitiesPropertyTypeMap, this.getDialect());
            let parameters = [];
            let sql = query.toSQL(true, parameters);
            let rawResults = yield this.findNative(sql, parameters);
            return query.parseQueryResults(rawResults);
        });
    }
    findOne(entityName, phSqlQuery) {
        return __awaiter(this, void 0, Promise, function* () {
            let results = yield this.find(entityName, phSqlQuery);
            if (results.length > 0) {
                throw `Expecting a single result, got ${results.length}`;
            }
            if (results.length == 1) {
                return results[0];
            }
            return null;
        });
    }
    save(entityName, entity) {
        return __awaiter(this, void 0, Promise, function* () {
            let qEntity = PH_1.PH.qEntityMap[entityName];
            let entityMetadata = qEntity.__entityConstructor__;
            if (!entityMetadata.idProperty) {
                throw `@Id is not defined for entity: ${entityName}`;
            }
            if (entity[entityMetadata.idProperty]) {
                yield this.update(entityName, entity);
            }
            else {
                yield this.create(entityName, entity);
            }
        });
    }
    search(entityName, phSqlQuery, subject) {
        if (!subject) {
            subject = new rxjs_1.Subject();
        }
        this.find(entityName, phSqlQuery).then((results) => {
            subject.next(results);
        });
        return subject;
    }
    searchOne(entityName, phQuery, subject) {
        return null;
    }
    warn(message) {
        console.log(message);
    }
}
exports.SqlAdaptor = SqlAdaptor;
//# sourceMappingURL=SqlAdaptor.js.map