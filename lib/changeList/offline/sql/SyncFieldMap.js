"use strict";
const querydsl_typescript_1 = require("querydsl-typescript");
const PHMetadataUtils_1 = require("../../../core/metadata/PHMetadataUtils");
/**
 * Created by Papa on 10/7/2016.
 */
class SyncFieldMap extends querydsl_typescript_1.FieldMap {
    ensureEntity(entityName) {
        let tableName = PHMetadataUtils_1.NameMetadataUtils.getTableName(entityName);
        return new SyncEntityFieldMap(super.ensure(entityName, tableName), entityName);
    }
}
exports.SyncFieldMap = SyncFieldMap;
class SyncEntityFieldMap {
    constructor(entityFieldMap, entityName) {
        this.entityFieldMap = entityFieldMap;
        this.entityName = entityName;
    }
    ensureField(propertyName) {
        let columnName = PHMetadataUtils_1.NameMetadataUtils.getPropertyColumnName(propertyName, this.entityName);
        this.entityFieldMap.ensure(propertyName, columnName);
    }
    ensureRelation(propertyName) {
        let joinColumnName = PHMetadataUtils_1.NameMetadataUtils.getJoinColumnName(propertyName, this.entityName);
        this.entityFieldMap.ensure(propertyName, joinColumnName);
    }
}
exports.SyncEntityFieldMap = SyncEntityFieldMap;
//# sourceMappingURL=SyncFieldMap.js.map