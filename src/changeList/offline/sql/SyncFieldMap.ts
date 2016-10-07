import {FieldMap, EntityFieldMap} from "querydsl-typescript";
import {NameMetadataUtils} from "../../../core/metadata/PHMetadataUtils";
/**
 * Created by Papa on 10/7/2016.
 */

export class SyncFieldMap extends FieldMap {

	ensureEntity(entityName: string) {
		let tableName = NameMetadataUtils.getTableName(entityName);
		return new SyncEntityFieldMap(super.ensure(entityName, tableName), entityName);
	}

}

export class SyncEntityFieldMap {
	constructor(
		public entityFieldMap: EntityFieldMap,
	  private entityName:string
	) {
	}

	ensureField(propertyName:string) {
		let columnName = NameMetadataUtils.getPropertyColumnName(propertyName, this.entityName);
		this.entityFieldMap.ensure(propertyName, columnName);
	}

	ensureRelation(propertyName:string) {
		let joinColumnName = NameMetadataUtils.getJoinColumnName(propertyName, this.entityName);
		this.entityFieldMap.ensure(propertyName, joinColumnName);
	}

}