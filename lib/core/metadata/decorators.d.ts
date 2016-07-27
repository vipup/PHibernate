/**
 * Created by Papa on 4/17/2016.
 */
import { IEntity } from "querydsl-typescript/lib/index";
import { PH } from "../../config/PH";
import { ManyToOneElements, OneToManyElements } from "../../config/JPAApi";
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
/**
 * Annotates query function pointers (variables).
 *
 * @param selectDefinition
 * @param fromWhereDefinition
 * @returns {function(any, string)}
 * @constructor
 */
export declare function Query<IE extends IEntity, IParams>(entityClass: any, selectDefinition: IE | {
    (select: any): IE;
}, fromWhereDefinition: IE | {
    (q: PH, params: IParams): IE;
}, paramsFactory: {
    (): IParams;
}): (target: any, propertyKey: string) => void;
