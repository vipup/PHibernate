import {
	QEntity, IQField, IQRelation, IBooleanOperation,
	BooleanOperation, RelationType, IDateOperation, DateOperation, INumberOperation, NumberOperation, IStringOperation,
	StringOperation
} from "querydsl-typescript/lib/index";
import {EntityUtils} from "../shared/EntityUtils";
import {PH_MAPPED_BY, PH_FOREIGN_KEYS} from "../core/metadata/decorators";
import {RelationRecord} from "querydsl-typescript/lib/core/entity/Relation";
/**
 * Created by Papa on 6/24/2016.
 */

export class PH {

	static qEntityMap:{[entityName:string]:QEntity<any>} = {};
	static entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}} = {};
	static entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}} = {};

	static getQEntityFromEntityClass(
		entityClass:any
	):QEntity<any> {
		let enityClassName = EntityUtils.getClassName(entityClass);
		let qEntity = PH.qEntityMap[enityClassName];

		return qEntity;
	}

	static addQEntity(
		entityConstructor:{new ():any},
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
		let mappedBy:{[propertyName:string]:string} = entityConstructor[PH_MAPPED_BY];
		let foreignKeys:{[propertyName:string]:string} = entityConstructor[PH_FOREIGN_KEYS];

		relations.forEach((
			relation:IQRelation<any, any, any>
		) => {
			let relationRecord:RelationRecord;
			let propertyName = relation.propertyName;
			let relationClassName = EntityUtils.getClassName(relation.relationEntityConstructor);
			switch (relation.relationType) {
				case RelationType.MANY_TO_ONE:
					relationRecord = {
						entityName: relationClassName,
						foreignKey: relation.relationPropertyName,
						mappedBy: null,
						propertyName: propertyName,
						relationType: relation.relationType
					};
					break;
				case RelationType.ONE_TO_MANY:
					relationRecord = {
						entityName: relationClassName,
						foreignKey: null,
						mappedBy: relation.relationPropertyName,
						propertyName: propertyName,
						relationType: relation.relationType
					};
					break;
			}
			entityRelationPropertyMap[propertyName] = relationRecord;
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

	static queryOperators:PH = new PH();
	static qOps:PH = PH.queryOperators;
	static q:PH = PH.qOps;

	booleanOperation:IBooleanOperation = new BooleanOperation(null);
	boolOp = this.booleanOperation;
	b = this.boolOp;

	dateOperation:IDateOperation = new DateOperation(null);
	dateOp = this.dateOperation;
	d = this.dateOp;

	numberOperation:INumberOperation = new NumberOperation(null);
	numOp = this.numberOperation;
	n = this.numOp;

	stringOperation:IStringOperation = new StringOperation(null);
	strOp = this.stringOperation;
	s = this.strOp;

}