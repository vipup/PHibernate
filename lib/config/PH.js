"use strict";
const index_1 = require("querydsl-typescript/lib/index");
const EntityUtils_1 = require("../shared/EntityUtils");
const decorators_1 = require("../core/metadata/decorators");
/**
 * Created by Papa on 6/24/2016.
 */
class PH {
    constructor() {
        this.booleanOperation = new index_1.BooleanOperation(null);
        this.boolOp = this.booleanOperation;
        this.b = this.boolOp;
        this.dateOperation = new index_1.DateOperation(null);
        this.dateOp = this.dateOperation;
        this.d = this.dateOp;
        this.numberOperation = new index_1.NumberOperation(null);
        this.numOp = this.numberOperation;
        this.n = this.numOp;
        this.stringOperation = new index_1.StringOperation(null);
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
        let mappedBy = entityConstructor[decorators_1.PH_MAPPED_BY];
        let foreignKeys = entityConstructor[decorators_1.PH_FOREIGN_KEYS];
        relations.forEach((relation) => {
            let relationRecord;
            let propertyName = relation.propertyName;
            let relationClassName = EntityUtils_1.EntityUtils.getClassName(relation.relationEntityConstructor);
            switch (relation.relationType) {
                case index_1.RelationType.MANY_TO_ONE:
                    relationRecord = {
                        entityName: relationClassName,
                        foreignKey: relation.relationPropertyName,
                        mappedBy: null,
                        propertyName: propertyName,
                        relationType: relation.relationType
                    };
                    break;
                case index_1.RelationType.ONE_TO_MANY:
                    relationRecord = {
                        entityName: relationClassName,
                        foreignKey: null,
                        mappedBy: relation.relationPropertyName,
                        propertyName: propertyName,
                        relationType: relation.relationType
                    };
                    break;
            }
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
}
PH.qEntityMap = {};
PH.entitiesRelationPropertyMap = {};
PH.entitiesPropertyTypeMap = {};
PH.queryOperators = new PH();
PH.qOps = PH.queryOperators;
PH.q = PH.qOps;
exports.PH = PH;
//# sourceMappingURL=PH.js.map