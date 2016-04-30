/**
 * Created by Papa on 4/17/2016.
 */

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
export function Query(
	queryDefinition:string
) {

	return function (
		targetObject:any,
		propertyKey:string
	) {
	}

}