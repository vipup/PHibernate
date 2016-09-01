"use strict";
const PH_1 = require("../../config/PH");
/**
 * Created by Papa on 8/31/2016.
 */
class DDLManager {
    getCreateTableDDL(entityName, ifExistsSupported) {
        let qEntity = PH_1.PH.qEntityMap[entityName];
        let entityMetadata = qEntity.__entityConstructor__;
        let columnMap = entityMetadata.columnMap;
        let joinColumnMap = entityMetadata.joinColumns;
        let entityPropertyTypeMap = PH_1.PH.entitiesPropertyTypeMap[entityName];
        let entityRelationMap = PH_1.PH.entitiesRelationPropertyMap[entityName];
        let columnNames = [];
        let columnName;
        for (let propertyName in entityPropertyTypeMap) {
            if (columnMap[propertyName]) {
                columnName = columnMap[propertyName].name;
                if (!columnName) {
                    throw `Found @Column but not @Column.name for '${entityName}.${propertyName}'.`;
                }
            }
            else if (joinColumnMap[propertyName]) {
                columnName = joinColumnMap[propertyName].name;
                if (!columnName) {
                    throw `Found @JoinColumn but not @JoinColumn.name for '${entityName}.${propertyName}'.`;
                }
            }
            else {
                this.warn(`Did not find @Column or @JoinColumn for '${entityName}.${propertyName}'. Using property name`);
                columnName = propertyName;
            }
        }
        for (let propertyName in entityRelationMap) {
        }
        let createTableStatement = `CREATE TABLE IF NOT EXISTS A (b,c)`;
        return createTableStatement;
    }
    warn(message) {
        console.log(message);
    }
}
exports.DDLManager = DDLManager;
//# sourceMappingURL=DDLManager.js.map