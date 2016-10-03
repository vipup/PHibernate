import {PH} from "../../config/PH";
import {EntityMetadata, MetadataUtils} from "querydsl-typescript";
/**
 * Created by Papa on 8/31/2016.
 */

export class DDLManager {

	static getCreateTableDDL(
		entityName: string
	): string {
		let qEntity = PH.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let columnMap = entityMetadata.columnMap;
		let joinColumnMap = entityMetadata.joinColumnMap;
		let entityPropertyTypeMap = PH.entitiesPropertyTypeMap[entityName];
		let entityRelationMap = PH.entitiesRelationPropertyMap[entityName];

		let columnNames: string[] = [];
		let columnName: string;
		for (let propertyName in entityPropertyTypeMap) {
			columnName = MetadataUtils.getPropertyColumnName(propertyName, entityMetadata);
			columnNames.push(columnName);
		}
		for (let propertyName in entityRelationMap) {
			if (entityMetadata.manyToOneMap[propertyName]) {
				if (joinColumnMap[propertyName]) {
					columnName = joinColumnMap[propertyName].name;
					if (!columnName) {
						throw `Found @JoinColumn but not @JoinColumn.name for '${entityName}.${propertyName}'.`;
					}
				} else {
					this.warn(`Did not find @JoinColumn for '${entityName}.${propertyName}'. Using property name.`);
					columnName = propertyName;
				}
				columnNames.push(columnName);
			}
		}

		let createTableStatement = `CREATE TABLE IF NOT EXISTS A (${columnNames.join(' , ')})`;
		return createTableStatement;
	}

	static warn(message: string) {
		console.log(message);
	}
}