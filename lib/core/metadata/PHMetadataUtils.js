"use strict";
const PH_1 = require("../../config/PH");
/**
 * Created by Papa on 9/2/2016.
 */
const querydsl_typescript_1 = require("querydsl-typescript");
/**
 * Provides an entry point into MetadataUtils when what is available is the QEntity
 */
class PHMetadataUtils {
    static getRelatedOneToManyConfig(manyToOnePropertyName, qEntity) {
        let entityMetadata = qEntity.__entityConstructor__;
        return querydsl_typescript_1.MetadataUtils.getRelatedOneToManyConfig(manyToOnePropertyName, entityMetadata);
    }
    static getPropertyColumnName(propertyName, qEntity) {
        let entityName = qEntity.__entityName__;
        let entityPropertyTypeMap = PH_1.PH.entitiesPropertyTypeMap[entityName];
        let entityProperty = entityPropertyTypeMap[propertyName];
        if (!entityProperty) {
            return null;
        }
        let entityMetadata = qEntity.__entityConstructor__;
        return querydsl_typescript_1.MetadataUtils.getPropertyColumnName(propertyName, entityMetadata);
    }
    static getJoinColumnName(propertyName, qEntity) {
        let entityName = qEntity.__entityName__;
        let entityRelationPropertyTypeMap = PH_1.PH.entitiesRelationPropertyMap[entityName];
        let relationRecord = entityRelationPropertyTypeMap[propertyName];
        if (!relationRecord) {
            return null;
        }
        let entityMetadata = qEntity.__entityConstructor__;
        return querydsl_typescript_1.MetadataUtils.getPropertyColumnName(propertyName, entityMetadata);
    }
    static getIdValue(entityObject, qEntity) {
        let entityMetadata = qEntity.__entityConstructor__;
        return querydsl_typescript_1.MetadataUtils.getIdValue(entityObject, entityMetadata);
    }
    static getIdFieldName(qEntity) {
        let entityMetadata = qEntity.__entityConstructor__;
        return entityMetadata.idProperty;
    }
    static getTableName(qEntity) {
        let entityMetadata = qEntity.__entityConstructor__;
        let tableName = querydsl_typescript_1.MetadataUtils.getTableName(entityMetadata);
        if (!tableName) {
            return qEntity.__entityName__;
        }
        return tableName;
    }
    static getOneToManyConfig(propertyName, qEntity) {
        let entityMetadata = qEntity.__entityConstructor__;
        return querydsl_typescript_1.MetadataUtils.getOneToManyConfig(propertyName, entityMetadata);
    }
}
exports.PHMetadataUtils = PHMetadataUtils;
/**
 * Provides an entry point into MetadataUtils when what is available is the name of the entity
 */
class NameMetadataUtils {
    static getRelatedOneToManyConfig(manyToOnePropertyName, entityName) {
        return PHMetadataUtils.getRelatedOneToManyConfig(manyToOnePropertyName, this.getQEntity(entityName));
    }
    static getPropertyColumnName(propertyName, entityName) {
        return PHMetadataUtils.getPropertyColumnName(propertyName, this.getQEntity(entityName));
    }
    static getIdValue(entityName, entityObject) {
        return PHMetadataUtils.getIdValue(this.getQEntity(entityName), entityObject);
    }
    static getIdFieldName(entityName) {
        return PHMetadataUtils.getIdFieldName(this.getQEntity(entityName));
    }
    static getOneToManyConfig(propertyName, entityName) {
        return PHMetadataUtils.getOneToManyConfig(propertyName, this.getQEntity(entityName));
    }
    static getTableName(entityName) {
        return PHMetadataUtils.getTableName(this.getQEntity(entityName));
    }
    static getQEntity(entityName) {
        let qEntity = PH_1.PH.qEntityMap[entityName];
        if (!qEntity) {
            throw `Could not find QEntity for Entity Name: ${entityName}`;
        }
        return qEntity;
    }
}
exports.NameMetadataUtils = NameMetadataUtils;
/**
 * Provides an entry point into MetadataUtils when what is available is the entity constructor
 */
class EntityMetadataUtils {
    static getPropertyColumnName(propertyName, entityClass) {
        let entityName = entityClass.name;
        return NameMetadataUtils.getPropertyColumnName(propertyName, entityName);
    }
}
exports.EntityMetadataUtils = EntityMetadataUtils;
//# sourceMappingURL=PHMetadataUtils.js.map