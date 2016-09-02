import {PH} from "../../config/PH";
/**
 * Created by Papa on 9/2/2016.
 */
import {IQEntity, EntityMetadata} from "querydsl-typescript";
import {MetadataUtils} from "./MetadataUtils";

export class PHMetadataUtils {

	static getPropertyColumnName<IQE extends IQEntity>(
		propertyName:string,
		qEntity:IQE
	):string {
		let entityName = qEntity.__entityName__;
		let entityPropertyTypeMap = PH.entitiesPropertyTypeMap[entityName];

		let entityProperty = entityPropertyTypeMap[propertyName];
		if(!entityProperty) {
			throw `Could not find Q property configuration for property ${entityProperty}, on Q${entityName}`;
		}

		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		return MetadataUtils.getPropertyColumnName(propertyName, entityMetadata);
	}
}

/**
 * Provides an entry point into MetadataUtils when what is available is the name of the entity
 */
export class NameMetadataUtils {


	static getPropertyColumnName(
		propertyName:string,
		entityName:string
	):string {
		let qEntity = PH.qEntityMap[entityName];

		if (!qEntity) {
			throw `Could not find QEntity for Entity Name: ${entityName}`;
		}

		return null;
	}
}

/**
 * Provides an entry point into MetadataUtils when what is available is the entity constructor
 */
export class EntityMetadataUtils {

	static getPropertyColumnName(
		propertyName:string,
		entityClass:{new ():any}
	):string {
		let entityName = entityClass.name;

		return NameMetadataUtils.getPropertyColumnName(propertyName, entityName);
	}

}