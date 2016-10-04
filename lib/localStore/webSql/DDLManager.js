"use strict";
const PH_1 = require("../../config/PH");
const querydsl_typescript_1 = require("querydsl-typescript");
/**
 * Created by Papa on 8/31/2016.
 */
class DDLManager {
    static getCreateTableDDL(entityName) {
        let qEntity = PH_1.PH.qEntityMap[entityName];
        let entityMetadata = qEntity.__entityConstructor__;
        let columnMap = entityMetadata.columnMap;
        let joinColumnMap = entityMetadata.joinColumnMap;
        let entityPropertyTypeMap = PH_1.PH.entitiesPropertyTypeMap[entityName];
        let entityRelationMap = PH_1.PH.entitiesRelationPropertyMap[entityName];
        let columnNames = [];
        let columnName;
        for (let propertyName in entityPropertyTypeMap) {
            columnName = querydsl_typescript_1.MetadataUtils.getPropertyColumnName(propertyName, entityMetadata);
            columnNames.push(columnName);
        }
        for (let propertyName in entityRelationMap) {
            if (entityMetadata.manyToOneMap[propertyName]) {
                if (joinColumnMap[propertyName]) {
                    columnName = joinColumnMap[propertyName].name;
                    if (!columnName) {
                        throw `Found @JoinColumn but not @JoinColumn.name for '${entityName}.${propertyName}'.`;
                    }
                }
                else {
                    this.warn(`Did not find @JoinColumn for '${entityName}.${propertyName}'. Using property name.`);
                    columnName = propertyName;
                }
                columnNames.push(columnName);
            }
        }
        let createTableStatement = `CREATE TABLE IF NOT EXISTS A (${columnNames.join(' , ')})`;
        return createTableStatement;
    }
    static warn(message) {
        console.log(message);
    }
}
exports.DDLManager = DDLManager;
//# sourceMappingURL=DDLManager.js.map