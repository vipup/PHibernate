/**
 * Created by Papa on 4/17/2016.
 */

import {DSLParser} from "../query/DSLParser";
import {IQEntity} from "querydsl-typescript/lib/index";
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
 * Annotates collections of Entities in other entities.
 *
 * @param foreignKeyFieldName
 * @returns {function(any, string)}
 * @constructor
 */
export function ForeignKey(
	foreignKeyFieldName:string
) {
	return function (
		targetObject:any,
		propertyKey:string
	) {

	}
}

export function MappedBy(
	collectionFieldName:string
) {
	return function (
		targetObject:any,
		propertyKey:string
	) {

	}
}

export interface RepositoryConfiguration {

}

export function Repository(
	repositoryConfiguration?:RepositoryConfiguration
) {

	return function ( constructor:Function ) {
	}

}

/**
 * Annotates query function pointers (variables).
 *
 * @param queryDefinition
 * @returns {function(any, string)}
 * @constructor
 */
export function Query<IQ extends IQEntity<IQ>>(
	queryDefinition:IQ,
  entityClass:Function
) {

	return function (
		targetObject:any,
		propertyKey:string
	) {
	}

}