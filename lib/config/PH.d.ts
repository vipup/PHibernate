import { QEntity } from "querydsl-typescript/lib/index";
/**
 * Created by Papa on 6/24/2016.
 */
export declare class PH {
    static qEntityMap: {
        [entityName: string]: QEntity<any>;
    };
    static entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: string;
        };
    };
    static entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    };
    static getQEntityFromEntityClass(entityClass: any): QEntity<any>;
    static addQEntity(qEntity: QEntity<any>): void;
}
