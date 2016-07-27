/**
 * Created by Papa on 4/17/2016.
 */

import {
	IQEntity, IQRelation, QEntity, QRelation,
	RelationType, IEntity, QStringField, QNumberField, QDateField, IQStringField,
	IQNumberField, IQDateField, IDateOperation, IStringOperation, INumberOperation, JSONStringOperation,
	JSONNumberOperation, JSONDateOperation
} from "querydsl-typescript/lib/index";
import {PH} from "../../config/PH";
import {ManyToOneElements, OneToManyElements} from "../../config/JPAApi";

export const PH_PRIMARY_KEY = '__primaryKey__';
export const PH_MANY_TO_ONE = '__ph_many_to_one__';
export const PH_ONE_TO_MANY = '__ph_one_to_many__';
export const PH_VISIBLE_FOR = '__ph_visible_for__';
export const PH_EDITABLE_FOR = '__ph_editable_for__';


/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
export function Id() {
	return function (
		targetObject:any,
		propertyKey:string
	) {
		if(targetObject[PH_PRIMARY_KEY]) {
			throw `Cannot set primary key to '${propertyKey}', it is already set to '${targetObject[PH_PRIMARY_KEY]}'`;
		}
		targetObject[PH_PRIMARY_KEY] = propertyKey;
	}
}

export interface EntityConfiguration {

}

/**
 * Annotates entities.
 *
 * @param entityConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function Entity(
	entityConfiguration?:EntityConfiguration
) {
	return function (
		constructor:Function
	) {
	}
}

/**
 * Specifies a single-valued association to another entity class that has many-to-one multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/ManyToOne.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export function ManyToOne(
	elements?:ManyToOneElements
) {
	return function (
		targetObject:any,
		propertyKey:string
	) {
		let manyToOne = targetObject[PH_MANY_TO_ONE];
		if(!manyToOne) {
			manyToOne = {};
			targetObject[PH_MANY_TO_ONE] = manyToOne;
		}
		manyToOne[propertyKey] = elements;
	}

}

/**
 * Specifies a many-valued association with one-to-many multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export function OneToMany(
	elements?:OneToManyElements
) {
	return function (
		targetObject:any,
		propertyKey:string
	) {
		let oneToMany = targetObject[PH_ONE_TO_MANY];
		if(!oneToMany) {
			oneToMany = {};
			targetObject[PH_ONE_TO_MANY] = oneToMany;
		}
		oneToMany[propertyKey] = elements;
	}

}

export interface AccessControlElements {
	roles: string[]
}

export interface VisibleForElements extends AccessControlElements {

}

export function VisibleFor(
	elements:VisibleForElements
) {

	return function (
		targetObject:any,
		propertyKey:string
	) {
		let visibleForMap = targetObject[PH_VISIBLE_FOR];
		if(!visibleForMap) {
			visibleForMap = {};
			targetObject[PH_VISIBLE_FOR] = visibleForMap;
		}
		visibleForMap[propertyKey] = elements;
	}

}

export interface EditableForElements extends AccessControlElements {

}

export function EditableFor(
	elements:EditableForElements
) {

	return function (
		targetObject:any,
		propertyKey:string
	) {
		let editableForMap = targetObject[PH_EDITABLE_FOR];
		if(!editableForMap) {
			editableForMap = {};
			targetObject[PH_EDITABLE_FOR] = editableForMap;
		}
		editableForMap[propertyKey] = elements;
	}

}

export interface RepositoryConfiguration {

}

export function Repository(
	repositoryConfiguration?:RepositoryConfiguration
) {

	return function (constructor:Function) {
	}

}

/**
 * Annotates query function pointers (variables).
 *
 * @param selectDefinition
 * @param fromWhereDefinition
 * @returns {function(any, string)}
 * @constructor
 */
export function Query<IE extends IEntity, IParams>(
	entityClass:any,
	selectDefinition:IE | {(select:any):IE},
	fromWhereDefinition:IE | {(q:PH, params:IParams):IE},
  paramsFactory:{():IParams}
) {

	return function (target, propertyKey:string) {
		Object.defineProperty(target, propertyKey, {
			get: function () {
				throw `Not implemented yet`;
			},
			set: function (val) {
			throw `Cannot override '${propertyKey}' @Query annotated reference, please define a parameter function.`;
			}
		});
	}

}
