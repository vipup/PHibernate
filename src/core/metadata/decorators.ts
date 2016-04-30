/**
 * Created by Papa on 4/17/2016.
 */

export interface EntityConfiguration {

}

export function Entity(
	entityConfiguration?:EntityConfiguration
) {
	return function (
		constructor:Function
	) {
	}
}


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

export function Query(
	queryDefinition:string
) {

	return function (
		targetObject:any,
		propertyKey: string,
		descriptor: PropertyDescriptor) {
	}

}