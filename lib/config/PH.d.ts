import { IEntity, QEntity, RelationRecord } from "querydsl-typescript";
import { PHPersistenceConfig } from "./PersistenceConfig";
import { EntityManager } from "../core/repository/EntityManager";
import { QuerySubject, QueryOneSubject } from "../core/query/QuerySubject";
/**
 * Created by Papa on 6/24/2016.
 */
export declare class PH {
    static qEntityMap: {
        [entityName: string]: QEntity<any>;
    };
    static entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    };
    static entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    };
    static startPersistenceContext(): void;
    static endPeristenceContext(): void;
    static getQEntityFromEntityClass(entityClass: any): QEntity<any>;
    static addQEntity(entityConstructor: {
        new (): any;
    }, qEntity: QEntity<any>): void;
    static entityManager: EntityManager;
    static init(phConfig: PHPersistenceConfig): void;
    static getFindSubject<E, IE extends IEntity>(entityClass: {
        new (): E;
    }): QuerySubject<E, IE>;
    static getFindOneSubject<E, IE extends IEntity>(entityClass: {
        new (): E;
    }): QueryOneSubject<E, IE>;
}
