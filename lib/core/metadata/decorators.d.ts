/**
 * Created by Papa on 4/17/2016.
 */
export interface EntityConfiguration {
}
export declare function Entity(entityConfiguration?: EntityConfiguration): (constructor: Function) => void;
export declare function ForeignKey(foreignKeyFieldName: string): (targetObject: any, propertyKey: string) => void;
export interface RepositoryConfiguration {
}
export declare function Repository(repositoryConfiguration?: RepositoryConfiguration): (constructor: Function) => void;
export declare function Query(queryDefinition: string): (targetObject: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
