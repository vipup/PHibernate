import { FieldType } from "querydsl-typescript";
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
}
export interface EntityProxyClass {
    __fieldMap__: {
        [fieldName: string]: EntityField;
    };
    __fieldTypeMap__: {
        [fieldName: string]: FieldType;
    };
}
