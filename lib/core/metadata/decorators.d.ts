/**
 * Created by Papa on 4/17/2016.
 */
import { GenerationType, AccessType } from "querydsl-typescript";
export declare const PH_VISIBLE_FOR = "__ph_visible_for__";
export declare const PH_EDITABLE_FOR = "__ph_editable_for__";
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
export declare function SequenceGenerator(sequenceGeneratorConfiguration?: SequenceGeneratorConfiguration): (constructor: Function) => void;
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
export declare function GeneratedValue(generatedValueConfiguration?: GeneratedValueConfiguration): (targetObject: any, propertyKey: string) => void;
/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function Access(accessType: AccessType): (targetObject: any, propertyKey: string) => void;
export interface AccessControlElements {
    roles: string[];
}
export declare function Transactional(): (target: any, methodName: string, methodDescriptor: any) => any;
export interface VisibleForElements extends AccessControlElements {
}
export declare function VisibleFor(elements: VisibleForElements): (targetObject: any, propertyKey: string) => void;
export interface EditableForElements extends AccessControlElements {
}
export declare function EditableFor(elements: EditableForElements): (targetObject: any, propertyKey: string) => void;
export interface RepositoryConfiguration {
}
export declare function Repository(repositoryConfiguration?: RepositoryConfiguration): (constructor: Function) => void;
