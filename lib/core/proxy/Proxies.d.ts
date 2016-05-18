/**
 * Created by Papa on 5/17/2016.
 */
export interface IEntityProxyWrapper {
    get: {
        (): any;
    };
    set: {
        (value: any): void;
    };
}
export declare enum FieldType {
    BOOLEAN = 0,
    DATE = 1,
    ENTITY = 2,
    ENTITY_ARRAY = 3,
    NUMBER = 4,
    STRING = 5,
}
export interface IProxiedEntity {
    __data__: {
        __accessed__: {
            [propertyName: string]: boolean;
        };
        __current__: {
            [propertyName: string]: any;
        };
        __initialized__: {
            [propertyName: string]: boolean;
        };
        __original__: {
            [propertyName: string]: any;
        };
        __types__: {
            [propertyName: string]: FieldType;
        };
    };
    __initialized__: boolean;
    __isDirty__: boolean;
    __proxied__: boolean;
}
export interface IProxiedEntityClass {
    ___proxyWrapperMap: {
        [proxyName: string]: IEntityProxyWrapper;
    };
    ___propertyWrapperMap: {
        [propertyName: string]: IEntityProxyWrapper;
    };
}
