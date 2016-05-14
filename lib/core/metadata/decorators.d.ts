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
 * Annotates collections of Entities in other entities.
 *
 * @param foreignKeyFieldName
 * @returns {function(any, string)}
 * @constructor
 */
export declare function ForeignKey(foreignKeyFieldName: string): (targetObject: any, propertyKey: string) => void;
export interface RepositoryConfiguration {
}
export declare function Repository(repositoryConfiguration?: RepositoryConfiguration): (constructor: Function) => void;
/**
 * Annotates query function pointers (variables).
 *
 * @param queryDefinition
 * @returns {function(any, string)}
 * @constructor
 */
export declare function Query(queryDefinition: string): (targetObject: any, propertyKey: string) => void;
