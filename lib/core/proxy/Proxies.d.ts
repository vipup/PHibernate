import { FieldType, RelationType } from "querydsl-typescript";
import { ChangeRecord } from "delta-store/lib/index";
/**
 * Created by Papa on 5/17/2016.
 */
export interface EntityField {
    get: {
        (): any;
    };
    set: {
        (value: any): void;
    };
}
export interface EntityRelation {
    get: {
        (): any;
    };
    set: {
        (value: any): void;
    };
}
export interface EntityProxy {
    __data__: {
        __accessed__: {
            [fieldName: string]: boolean;
        };
        __current__: {
            [fieldName: string]: any;
        };
        __initialized__: {
            [fieldName: string]: boolean;
        };
        __original__: {
            [fieldName: string]: any;
        };
    };
    __initialized__: boolean;
    __isDirty__: boolean;
    __proxied__: boolean;
    getChangeRecord(): ChangeRecord;
}
export interface EntityProxyClass {
    __fieldMap__: {
        [fieldName: string]: EntityField;
    };
    __fieldTypeMap__: {
        [fieldName: string]: FieldType;
    };
    __relationMap__: {
        [relationName: string]: EntityRelation;
    };
    __relationTypeMap__: {
        [relationName: string]: RelationType;
    };
}
