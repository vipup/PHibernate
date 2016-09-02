/**
 * Created by Papa on 4/17/2016.
 */
import {GenerationType, AccessType} from "querydsl-typescript";
import {PH} from "../../config/PH";

export const PH_VISIBLE_FOR = '__ph_visible_for__';
export const PH_EDITABLE_FOR = '__ph_editable_for__';

export interface SequenceGeneratorConfiguration {
	name: string;
	sequenceName: string;
}

/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function SequenceGenerator(sequenceGeneratorConfiguration?: SequenceGeneratorConfiguration) {
	return function (constructor: Function) {
	}
}

export interface GeneratedValueConfiguration {
	generator: string;
	strategy: GenerationType;
}

/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function GeneratedValue(generatedValueConfiguration?: GeneratedValueConfiguration) {
	return function (
		targetObject: any,
		propertyKey: string
	) {
	}
}


/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function Access(accessType: AccessType) {
	return function (
		targetObject: any,
		propertyKey: string
	) {
	}
}
export interface AccessControlElements {
	roles: string[]
}

export function Transactional() {
	return function (target: Function, methodName: string, methodDescriptor: any) {
		// save a reference to the original method
		// this way we keep the values currently in the
		// descriptor and don't overwrite what another
		// decorator might have done to the descriptor.
		var originalMethod = methodDescriptor.value;

		//editing the descriptor/value parameter
		methodDescriptor.value = function (...args: any[]) {
			/**
			 var result;
			 PH.entityManager.getLocalStore().wrapInTransaction(() => {
			// note usage of originalMethod here
				result = originalMethod.apply(this, args);
			});
			 return result;*/

			/**
			 return new Promise((resolve, reject) => {
				PH.entityManager.getLocalStore().wrapInTransaction(() => {
					// note usage of originalMethod here
					var promise = originalMethod.apply(this, args);
					promise.then(resolve, reject);
				});
			});*/
			/**
			 let result;
			 PH.entityManager.getLocalStore().wrapInTransaction(() => {
				// note usage of originalMethod here
				result = originalMethod.apply(this, args);

				return result;
			});
			 if (result instanceof Promise) {
				return new Promise((resolve, reject) => {
					result.then(resolve, reject);
				});
			} else {
				return result;
			}
			 */
			return PH.entityManager.getLocalStore().wrapInTransaction(() => {
				// note usage of originalMethod here
				let result = originalMethod.apply(this, args);

				return result;
			});

		};

		// return edited descriptor as opposed to overwriting
		// the descriptor by returning a new descriptor
		return methodDescriptor;
	}
}

export interface VisibleForElements extends AccessControlElements {

}

export function VisibleFor(elements: VisibleForElements) {

	return function (
		targetObject: any,
		propertyKey: string
	) {
		let visibleForMap = targetObject[PH_VISIBLE_FOR];
		if (!visibleForMap) {
			visibleForMap = {};
			targetObject[PH_VISIBLE_FOR] = visibleForMap;
		}
		visibleForMap[propertyKey] = elements;
	}

}

export interface EditableForElements extends AccessControlElements {

}

export function EditableFor(elements: EditableForElements) {

	return function (
		targetObject: any,
		propertyKey: string
	) {
		let editableForMap = targetObject[PH_EDITABLE_FOR];
		if (!editableForMap) {
			editableForMap = {};
			targetObject[PH_EDITABLE_FOR] = editableForMap;
		}
		editableForMap[propertyKey] = elements;
	}

}

export interface RepositoryConfiguration {

}

export function Repository(repositoryConfiguration?: RepositoryConfiguration) {

	return function (constructor: Function) {
	}

}
