"use strict";
const EntityUtils_1 = require("../shared/EntityUtils");
/**
 * Created by Papa on 6/24/2016.
 */
class PH {
    static getQEntityFromEntityClass(entityClass) {
        let enityClassName = EntityUtils_1.EntityUtils.getClassName(entityClass);
        let qEntity = PH.qEntityMap[enityClassName];
        return qEntity;
    }
    static addQEntity(qEntity) {
        let entityName = qEntity.__entityName__;
        let fields = qEntity.__entityFields__;
        let relations = qEntity.__entityRelations__;
        PH.qEntityMap[entityName] = qEntity;
        let entityRelationPropertyMap = PH.entitiesRelationPropertyMap[entityName];
        if (entityRelationPropertyMap) {
            entityRelationPropertyMap = {};
            PH.entitiesRelationPropertyMap[entityName] = entityRelationPropertyMap;
        }
        relations.forEach((relation) => {
            let propertyName = relation.relationPropertyName;
            let relationClassName = EntityUtils_1.EntityUtils.getClassName(relation.relationEntityConstructor);
            entityRelationPropertyMap[propertyName] = relationClassName;
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
exports.PH = PH;
//# sourceMappingURL=PH.js.map