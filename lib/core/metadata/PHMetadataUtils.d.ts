/**
 * Created by Papa on 9/2/2016.
 */
import { IQEntity, OneToManyConfigAndProperty, OneToManyElements } from "querydsl-typescript";
/**
 * Provides an entry point into MetadataUtils when what is available is the QEntity
 */
export declare class PHMetadataUtils {
    static getRelatedOneToManyConfig<IQE extends IQEntity>(manyToOnePropertyName: string, qEntity: IQE): OneToManyConfigAndProperty;
    static getPropertyColumnName<IQE extends IQEntity>(propertyName: string, qEntity: IQE): string;
    static getJoinColumnName<IQE extends IQEntity>(propertyName: string, qEntity: IQE): string;
    static getIdValue<IQE extends IQEntity>(entityObject: any, qEntity: IQE): string;
    static getTableName<IQE extends IQEntity>(qEntity: IQE): string;
    static getOneToManyConfig<IQE extends IQEntity>(propertyName: string, qEntity: IQE): OneToManyElements;
}
/**
 * Provides an entry point into MetadataUtils when what is available is the name of the entity
 */
export declare class NameMetadataUtils {
    static getRelatedOneToManyConfig(manyToOnePropertyName: string, entityName: string): OneToManyConfigAndProperty;
    static getPropertyColumnName(propertyName: string, entityName: string): string;
    static getIdValue(entityName: string, entityObject: any): string;
    static getOneToManyConfig(propertyName: string, entityName: string): OneToManyElements;
    static getTableName(entityName: string): string;
    static getQEntity(entityName: string): IQEntity;
}
/**
 * Provides an entry point into MetadataUtils when what is available is the entity constructor
 */
export declare class EntityMetadataUtils {
    static getPropertyColumnName(propertyName: string, entityClass: {
        new (): any;
    }): string;
}
