/**
 * Created by Papa on 4/17/2016.
 */
import {GenerationType, AccessType} from "querydsl-typescript";

export const PH_VISIBLE_FOR = '__ph_visible_for__';
export const PH_EDITABLE_FOR = '__ph_editable_for__';

export interface SequenceGeneratorConfiguration {
    name:string;
    sequenceName:string;
}

/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function SequenceGenerator(sequenceGeneratorConfiguration?:SequenceGeneratorConfiguration) {
    return function (constructor:Function) {
    }
}

export interface GeneratedValueConfiguration {
    generator:string;
    strategy:GenerationType;
}

/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function GeneratedValue(generatedValueConfiguration?:GeneratedValueConfiguration) {
    return function (targetObject:any,
                     propertyKey:string) {
    }
}


/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function Access(accessType:AccessType) {
    return function (targetObject:any,
                     propertyKey:string) {
    }
}
export interface AccessControlElements {
    roles:string[]
}

export interface VisibleForElements extends AccessControlElements {

}

export function VisibleFor(elements:VisibleForElements) {

    return function (targetObject:any,
                     propertyKey:string) {
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

export function EditableFor(elements:EditableForElements) {

    return function (targetObject:any,
                     propertyKey:string) {
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

export function Repository(repositoryConfiguration?:RepositoryConfiguration) {

    return function (constructor:Function) {
    }

}
