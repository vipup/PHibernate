import {QEntity, IQEntity, IQField, IQRelation} from "querydsl-typescript/lib/index";
import {EntityUtils} from "../shared/EntityUtils";
/**
 * Created by Papa on 6/24/2016.
 */

export class PH {

	static qEntityMap:{[entityName:string]:QEntity<any>} = {};
	static entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:string}} = {};
	static entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}} = {};

	static getQEntityFromEntityClass(
		entityClass:any
	):QEntity<any> {
		let enityClassName = EntityUtils.getClassName(entityClass);
		let qEntity = PH.qEntityMap[enityClassName];

		return qEntity;
	}

	static addQEntity(
		qEntity:QEntity<any>
	) {
		let entityName = qEntity.__entityName__;
		let fields = qEntity.__entityFields__;
		let relations = qEntity.__entityRelations__;

		PH.qEntityMap[entityName] = qEntity;

		let entityRelationPropertyMap = PH.entitiesRelationPropertyMap[entityName];
		if (entityRelationPropertyMap) {
			entityRelationPropertyMap = {};
			PH.entitiesRelationPropertyMap[entityName] = entityRelationPropertyMap;
		}
		relations.forEach((
			relation:IQRelation<any, any, any>
		) => {
			let propertyName = relation.relationPropertyName;
			let relationClassName = EntityUtils.getClassName(relation.relationEntityConstructor);
			entityRelationPropertyMap[propertyName] = relationClassName;
		});

		let entityPropertyTypeMap = PH.entitiesPropertyTypeMap[entityName];
		if (entityPropertyTypeMap) {
			entityPropertyTypeMap = {};
			PH.entitiesPropertyTypeMap[entityName] = entityPropertyTypeMap;
		}
		fields.forEach((
			field:IQField<any>
		) => {
			entityPropertyTypeMap[field.fieldName] = true;
		});
	}
}