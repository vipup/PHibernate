"use strict";
class MetadataUtils {
    static getRelatedOneToManyConfig(manyToOnePropertyName, entityMetadata) {
        for (let oneToManyProperty in entityMetadata.oneToManyMap) {
            let oneToManyConfig = entityMetadata.oneToManyMap[oneToManyProperty];
            if (oneToManyConfig.mappedBy === manyToOnePropertyName) {
                return {
                    propertyName: oneToManyProperty,
                    config: oneToManyConfig
                };
            }
        }
        return null;
    }
    static getPropertyColumnName(propertyName, entityMetadata) {
        let entityName = entityMetadata.name;
        let columnMap = entityMetadata.columnMap;
        let columnName;
        if (columnMap[propertyName]) {
            columnName = columnMap[propertyName].name;
            if (!columnName) {
                throw `Found @Column but not @Column.name for '${entityName}.${propertyName}'.`;
            }
        }
        else {
            this.warn(`Did not find @Column for '${entityName}.${propertyName}'. Using property name.`);
            columnName = propertyName;
        }
        return columnName;
    }
    static getJoinColumnName(propertyName, entityMetadata) {
        let entityName = entityMetadata.name;
        let joinColumnMap = entityMetadata.joinColumnMap;
        let joinColumnName;
        if (joinColumnMap[propertyName]) {
            joinColumnName = joinColumnMap[propertyName].name;
            if (!joinColumnName) {
                throw `Found @JoinColumn but not @JoinColumn.name for '${entityName}.${propertyName}'.`;
            }
        }
        else {
            this.warn(`Did not find @JoinColumn for '${entityName}.${propertyName}'. Using property name.`);
            joinColumnName = propertyName;
        }
        return joinColumnName;
    }
    // static getManyToOneColumnName(
    // 	propertyName:string,
    // 	entityMetadata:EntityMetadata
    // ):string {
    //
    // }
    static getIdValue(entityObject, entityMetadata) {
        let idProperty = entityMetadata.idProperty;
        if (!idProperty) {
            throw `@Id is not defined on entity ${entityMetadata.name}`;
        }
        return entityObject[idProperty];
    }
    static getTableName(entityMetadata) {
        let tableConfig = entityMetadata.table;
        if (!tableConfig) {
            return null;
        }
        if (tableConfig && !tableConfig.name) {
            throw `@Table is defined on ${entityMetadata.name}, but @Table.name is not`;
        }
        return tableConfig.name;
    }
    static getOneToManyConfig(propertyName, entityMetadata) {
        let oneToManyConfig = entityMetadata.oneToManyMap[propertyName];
        if (!oneToManyConfig) {
            throw `@OneToMany is not defined on ${entityMetadata.name}.${propertyName}`;
        }
        return oneToManyConfig;
    }
    static warn(message) {
        console.log(message);
    }
}
exports.MetadataUtils = MetadataUtils;
//# sourceMappingURL=MetadataUtils.js.map