"use strict";
const EntityUtils_1 = require("../shared/EntityUtils");
const PersistenceConfig_1 = require("./PersistenceConfig");
const EntityManager_1 = require("../core/repository/EntityManager");
const QuerySubject_1 = require("../core/query/QuerySubject");
/**
 * Created by Papa on 6/24/2016.
 */
class PH {
    static getQEntityFromEntityClass(entityClass) {
        let entityClassName = EntityUtils_1.EntityUtils.getClassName(entityClass);
        let qEntity = PH.qEntityMap[entityClassName];
        return qEntity;
    }
    static addQEntity(entityConstructor, qEntity) {
        let entityName = qEntity.__entityName__;
        let fields = qEntity.__entityFieldMap__;
        let relations = qEntity.__entityRelationMap__;
        PH.qEntityMap[entityName] = qEntity;
        let entityRelationPropertyMap = PH.entitiesRelationPropertyMap[entityName];
        if (entityRelationPropertyMap) {
            entityRelationPropertyMap = {};
            PH.entitiesRelationPropertyMap[entityName] = entityRelationPropertyMap;
        }
        let entityMetadata = entityConstructor;
        for (let relationPropertyName in relations) {
            let relation = relations[relationPropertyName];
            let propertyName = relation.propertyName;
            let relationClassName = EntityUtils_1.EntityUtils.getClassName(relation.relationEntityConstructor);
            let relationRecord = {
                entityName: relationClassName,
                propertyName: propertyName,
                relationType: relation.relationType
            };
            entityRelationPropertyMap[propertyName] = relationRecord;
        }
        let entityPropertyTypeMap = PH.entitiesPropertyTypeMap[entityName];
        if (entityPropertyTypeMap) {
            entityPropertyTypeMap = {};
            PH.entitiesPropertyTypeMap[entityName] = entityPropertyTypeMap;
        }
        for (let fieldPropertyName in fields) {
            let field = fields[fieldPropertyName];
            entityPropertyTypeMap[field.fieldName] = true;
        }
    }
    static init(phConfig) {
        let persistenceConfig = new PersistenceConfig_1.PersistenceConfig(phConfig);
        PH.entityManager = new EntityManager_1.EntityManager(persistenceConfig);
    }
    static getFindSubject(entityClass) {
        let subscription;
        let querySubject = new QuerySubject_1.QuerySubject(entityClass, () => {
            if (querySubject.resultsSubject.observers.length < 1) {
                subscription.unsubscribe();
            }
        });
        subscription = querySubject.querySubject.subscribe((//
            iEntityQuery //
            ) => {
            PH.entityManager.search(entityClass, iEntityQuery, querySubject.resultsSubject);
        });
        return querySubject;
    }
    static getFindOneSubject(entityClass) {
        let subscription;
        let querySubject = new QuerySubject_1.QueryOneSubject(entityClass, () => {
            if (querySubject.resultsSubject.observers.length < 1) {
                subscription.unsubscribe();
            }
        });
        subscription = querySubject.querySubject.subscribe((//
            iEntityQuery //
            ) => {
            PH.entityManager.searchOne(entityClass, iEntityQuery, querySubject.resultsSubject);
        });
        return querySubject;
    }
}
PH.qEntityMap = {};
PH.entitiesRelationPropertyMap = {};
PH.entitiesPropertyTypeMap = {};
exports.PH = PH;
//# sourceMappingURL=PH.js.map