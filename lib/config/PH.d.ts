import { IEntity, QEntity, IBooleanOperation, IDateOperation, INumberOperation, IStringOperation, RelationRecord } from "querydsl-typescript";
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
    static getQEntityFromEntityClass(entityClass: any): QEntity<any>;
    static addQEntity(entityConstructor: {
        new (): any;
    }, qEntity: QEntity<any>): void;
    static queryOperators: PH;
    static qOps: PH;
    static q: PH;
    booleanOperation: IBooleanOperation;
    boolOp: IBooleanOperation;
    b: IBooleanOperation;
    dateOperation: IDateOperation;
    dateOp: IDateOperation;
    d: IDateOperation;
    numberOperation: INumberOperation;
    numOp: INumberOperation;
    n: INumberOperation;
    stringOperation: IStringOperation;
    strOp: IStringOperation;
    s: IStringOperation;
    static entityManager: EntityManager;
    static init(phConfig: PHPersistenceConfig): void;
    static getFindSubject<E, IE extends IEntity>(entityClass: {
        new (): E;
    }): QuerySubject<E, IE>;
    static getFindOneSubject<E, IE extends IEntity>(entityClass: {
        new (): E;
    }): QueryOneSubject<E, IE>;
}
