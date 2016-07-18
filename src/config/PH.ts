import {
	QEntity, IQField, IQRelation, IBooleanOperation,
	BooleanOperation, RelationType, IDateOperation, DateOperation, INumberOperation, NumberOperation, IStringOperation,
	StringOperation
} from "querydsl-typescript/lib/index";
import {EntityUtils} from "../shared/EntityUtils";
import {PH_MANY_TO_ONE, PH_ONE_TO_MANY} from "../core/metadata/decorators";
import {RelationRecord} from "querydsl-typescript/lib/core/entity/Relation";
import {ManyToOneElements, OneToManyElements} from "./JPAApi";
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
		let manyToOneConfigs:{[propertyName:string]:ManyToOneElements} = entityConstructor[PH_MANY_TO_ONE];
		let oneToManyConfigs:{[propertyName:string]:OneToManyElements} = entityConstructor[PH_ONE_TO_MANY];

		relations.forEach((
			relation:IQRelation<any, any, any>
		) => {
			let propertyName = relation.propertyName;
			let relationClassName = EntityUtils.getClassName(relation.relationEntityConstructor);

			let decoratorElements = {};

			switch (relation.relationType) {
				case RelationType.MANY_TO_ONE:
					decoratorElements[PH_MANY_TO_ONE] = manyToOneConfigs[propertyName];
					break;
				case RelationType.ONE_TO_MANY:
					decoratorElements[PH_ONE_TO_MANY] = oneToManyConfigs[propertyName];
					break;
			}
			
			let relationRecord:RelationRecord = {
				entityName: relationClassName,
				decoratorElements: decoratorElements,
				propertyName: propertyName,
				relationType: relation.relationType
			};

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