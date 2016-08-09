"use strict";
const querydsl_typescript_1 = require("querydsl-typescript");
const EntityUtils_1 = require("../shared/EntityUtils");
const decorators_1 = require("../core/metadata/decorators");
const PersistenceConfig_1 = require("./PersistenceConfig");
const EntityManager_1 = require("../core/repository/EntityManager");
const QuerySubject_1 = require("../core/query/QuerySubject");
/**
 * Created by Papa on 6/24/2016.
 */
class PH {
    constructor() {
        this.booleanOperation = new querydsl_typescript_1.BooleanOperation(null);
        this.boolOp = this.booleanOperation;
        this.b = this.boolOp;
        this.dateOperation = new querydsl_typescript_1.DateOperation(null);
        this.dateOp = this.dateOperation;
        this.d = this.dateOp;
        this.numberOperation = new querydsl_typescript_1.NumberOperation(null);
        this.numOp = this.numberOperation;
        this.n = this.numOp;
        this.stringOperation = new querydsl_typescript_1.StringOperation(null);
        this.strOp = this.stringOperation;
        this.s = this.strOp;
    }
    static getQEntityFromEntityClass(entityClass) {
        let enityClassName = EntityUtils_1.EntityUtils.getClassName(entityClass);
        let qEntity = PH.qEntityMap[enityClassName];
        return qEntity;
    }
    static addQEntity(entityConstructor, qEntity) {
        let entityName = qEntity.__entityName__;
        let fields = qEntity.__entityFields__;
        let relations = qEntity.__entityRelations__;
        PH.qEntityMap[entityName] = qEntity;
        let entityRelationPropertyMap = PH.entitiesRelationPropertyMap[entityName];
        if (entityRelationPropertyMap) {
            entityRelationPropertyMap = {};
            PH.entitiesRelationPropertyMap[entityName] = entityRelationPropertyMap;
        }
        let manyToOneConfigs = entityConstructor[decorators_1.PH_MANY_TO_ONE];
        let oneToManyConfigs = entityConstructor[decorators_1.PH_ONE_TO_MANY];
        relations.forEach((relation) => {
            let propertyName = relation.propertyName;
            let relationClassName = EntityUtils_1.EntityUtils.getClassName(relation.relationEntityConstructor);
            let decoratorElements = {};
            switch (relation.relationType) {
                case querydsl_typescript_1.RelationType.MANY_TO_ONE:
                    decoratorElements[decorators_1.PH_MANY_TO_ONE] = manyToOneConfigs[propertyName];
                    break;
                case querydsl_typescript_1.RelationType.ONE_TO_MANY:
                    decoratorElements[decorators_1.PH_ONE_TO_MANY] = oneToManyConfigs[propertyName];
                    break;
            }
            let relationRecord = {
                entityName: relationClassName,
                decoratorElements: decoratorElements,
                propertyName: propertyName,
                relationType: relation.relationType
            };
            entityRelationPropertyMap[propertyName] = relationRecord;
        });
        let entityPropertyTypeMap = PH.entitiesPropertyTypeMap[entityName];
        if (entityPropertyTypeMap) {
            entityPropertyTypeMap = {};
            PH.entitiesPropertyTypeMap[entityName] = entityPropertyTypeMap;
        }
        fields.forEach((field) => {
            entityPropertyTypeMap[field.fieldName] = true;
        });
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
            iEntity //
            ) => {
            PH.entityManager.search(entityClass, iEntity, querySubject.resultsSubject);
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
            iEntity //
            ) => {
            PH.entityManager.searchOne(entityClass, iEntity, querySubject.resultsSubject);
        });
        return querySubject;
    }
}
PH.qEntityMap = {};
PH.entitiesRelationPropertyMap = {};
PH.entitiesPropertyTypeMap = {};
PH.queryOperators = new PH();
PH.qOps = PH.queryOperators;
PH.q = PH.qOps;
exports.PH = PH;
//# sourceMappingURL=PH.js.map