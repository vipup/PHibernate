import { AccessType, GenerationType, ManyToOneElements, OneToManyElements } from "../../config/JPAApi";
export declare const PH_PRIMARY_KEY: string;
export declare const PH_MANY_TO_ONE: string;
export declare const PH_ONE_TO_MANY: string;
export declare const PH_VISIBLE_FOR: string;
export declare const PH_EDITABLE_FOR: string;
/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
export declare function Id(): (targetObject: any, propertyKey: string) => void;
export interface EntityConfiguration {
}
/**
 * Annotates entities.
 *
 * @param entityConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function Entity(entityConfiguration?: EntityConfiguration): (constructor: Function) => void;
export interface TableConfiguration {
    name: string;
}
/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function Table(tableConfiguration?: TableConfiguration): (constructor: Function) => void;
/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function MappedSuperclass(): (constructor: Function) => void;
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
export interface ColumnConfiguration {
    name: string;
}
/**
 * Annotates columns.
 *
 * @param columnConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function Column(columnConfiguration?: ColumnConfiguration): (targetObject: any, propertyKey: string) => void;
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
export interface JoinColumnConfiguration {
    name: string;
    nullable: boolean;
}
/**
 * Annotates columns.
 *
 * @param columnConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function JoinColumn(joinColumnConfiguration?: JoinColumnConfiguration): (targetObject: any, propertyKey: string) => void;
/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function Transient(): (targetObject: any, propertyKey: string) => void;
/**
 * Specifies a single-valued association to another entity class that has many-to-one multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/ManyToOne.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export declare function ManyToOne(elements?: ManyToOneElements): (targetObject: any, propertyKey: string) => void;
/**
 * Specifies a many-valued association with one-to-many multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export declare function OneToMany(elements?: OneToManyElements): (targetObject: any, propertyKey: string) => void;
export interface AccessControlElements {
    roles: string[];
}
export interface VisibleForElements extends AccessControlElements {
}
export declare function VisibleFor(elements: VisibleForElements): (targetObject: any, propertyKey: string) => void;
export interface EditableForElements extends AccessControlElements {
}
export declare function EditableFor(elements: EditableForElements): (targetObject: any, propertyKey: string) => void;
export interface RepositoryConfiguration {
}
export declare function Repository(repositoryConfiguration?: RepositoryConfiguration): (constructor: Function) => void;
