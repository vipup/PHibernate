import { QEntity, IBooleanOperation, IDateOperation, INumberOperation, IStringOperation } from "querydsl-typescript/lib/index";
import { RelationRecord } from "querydsl-typescript/lib/core/entity/Relation";
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
}
