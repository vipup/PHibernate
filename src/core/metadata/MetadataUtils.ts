/**
 * Created by Papa on 9/2/2016.
 */
import {EntityMetadata} from "querydsl-typescript";

export class MetadataUtils {

	static getPropertyColumnName(
		propertyName:string,
		entityMetadata:EntityMetadata
	):string {
		let entityName = entityMetadata.name;
		let columnMap = entityMetadata.columnMap;
		let columnName:string;
		if (columnMap[propertyName]) {
			columnName = columnMap[propertyName].name;
			if (!columnName) {
				throw `Found @Column but not @Column.name for '${entityName}.${propertyName}'.`;
			}
		} else {
			this.warn(`Did not find @Column for '${entityName}.${propertyName}'. Using property name.`);
			columnName = propertyName;
		}

		return columnName;
	}

	static getJoinColumnName(
		propertyName:string,
		entityMetadata:EntityMetadata
	):string {
		let entityName = entityMetadata.name;
		let joinColumnMap = entityMetadata.joinColumnMap;
		let joinColumnName:string;
		if (joinColumnMap[propertyName]) {
			joinColumnName = joinColumnMap[propertyName].name;
			if (!joinColumnName) {
				throw `Found @JoinColumn but not @JoinColumn.name for '${entityName}.${propertyName}'.`;
			}
		} else {
			this.warn(`Did not find @JoinColumn for '${entityName}.${propertyName}'. Using property name.`);
			joinColumnName = propertyName;
		}

		return joinColumnName;
	}

	static getManyToOneColumnName(
		propertyName:string,
		entityMetadata:EntityMetadata
	):string {

	}

	static warn(message: string) {
		console.log(message);
	}

}