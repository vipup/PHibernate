import {PH} from "../../config/PH";
/**
 * Created by Papa on 9/2/2016.
 */
import {IQEntity, EntityMetadata, MetadataUtils, OneToManyConfigAndProperty, QEntity, OneToManyElements} from "querydsl-typescript";

/**
 * Provides an entry point into MetadataUtils when what is available is the QEntity
 */
export class PHMetadataUtils {

	static getRelatedOneToManyConfig<IQE extends IQEntity>(
		manyToOnePropertyName: string,
		qEntity: IQE
	): OneToManyConfigAndProperty {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		return MetadataUtils.getRelatedOneToManyConfig(manyToOnePropertyName, entityMetadata);
	}

	static getPropertyColumnName<IQE extends IQEntity>(
		propertyName: string,
		qEntity: IQE
	): string {
		let entityName = qEntity.__entityName__;
		let entityPropertyTypeMap = PH.entitiesPropertyTypeMap[entityName];

		let entityProperty = entityPropertyTypeMap[propertyName];
		if (!entityProperty) {
			return null;
		}

		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		return MetadataUtils.getPropertyColumnName(propertyName, entityMetadata);
	}

	static getJoinColumnName<IQE extends IQEntity>(
		propertyName: string,
		qEntity: IQE
	): string {
		let entityName = qEntity.__entityName__;
		let entityRelationPropertyTypeMap = PH.entitiesRelationPropertyMap[entityName];

		let relationRecord = entityRelationPropertyTypeMap[propertyName];
		if (!relationRecord) {
			return null;
		}

		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		return MetadataUtils.getJoinColumnName(propertyName, entityMetadata);

	}

	static getIdValue<IQE extends IQEntity>(
		entityObject: any,
		qEntity: IQE
	): string {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		return MetadataUtils.getIdValue(entityObject, entityMetadata);
	}

	static getIdFieldName<IQE extends IQEntity>(
		qEntity: IQE
	): string {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		return entityMetadata.idProperty;
	}

	static getTableName<IQE extends IQEntity>(
		qEntity: IQE
	): string {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let tableName = MetadataUtils.getTableName(entityMetadata);

		if (!tableName) {
			return qEntity.__entityName__;
		}
		return tableName;
	}

	static getOneToManyConfig<IQE extends IQEntity>(
		propertyName: string,
		qEntity: IQE
	): OneToManyElements {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		return MetadataUtils.getOneToManyConfig(propertyName, entityMetadata);
	}
}

/**
 * Provides an entry point into MetadataUtils when what is available is the name of the entity
 */
export class NameMetadataUtils {

	static getRelatedOneToManyConfig(
		manyToOnePropertyName:string,
		entityName: string
	): OneToManyConfigAndProperty {
		return PHMetadataUtils.getRelatedOneToManyConfig(manyToOnePropertyName, this.getQEntity(entityName));
	}


	static getPropertyColumnName(
		propertyName: string,
		entityName: string
	): string {
		return PHMetadataUtils.getPropertyColumnName(propertyName, this.getQEntity(entityName));
	}

	static getJoinColumnName<IQE extends IQEntity>(
		propertyName: string,
		entityName: string
	): string {
		return PHMetadataUtils.getJoinColumnName(propertyName, this.getQEntity(entityName));
	}

	static getIdValue(
		entityName: string,
		entityObject: any
	): string {
		return PHMetadataUtils.getIdValue(this.getQEntity(entityName), entityObject);
	}

	static getIdFieldName(
		entityName: string
	): string {
		return PHMetadataUtils.getIdFieldName(this.getQEntity(entityName));
	}

	static getOneToManyConfig(
		propertyName: string,
		entityName: string
	): OneToManyElements {
		return PHMetadataUtils.getOneToManyConfig(propertyName, this.getQEntity(entityName));
	}

	static getTableName(
		entityName: string
	): string {
		return PHMetadataUtils.getTableName(this.getQEntity(entityName));
	}

	static getQEntity(entityName: string): IQEntity {

		let qEntity = PH.qEntityMap[entityName];

		if (!qEntity) {
			throw `Could not find QEntity for Entity Name: ${entityName}`;
		}

		return qEntity;
	}
}

/**
 * Provides an entry point into MetadataUtils when what is available is the entity constructor
 */
export class EntityMetadataUtils {

	static getPropertyColumnName(
		propertyName: string,
		entityClass: {new (): any}
	): string {
		let entityName = entityClass.name;

		return NameMetadataUtils.getPropertyColumnName(propertyName, entityName);
	}

}