import { IProxiedEntity, FieldType } from "./Proxies";
/**
 * Created by Papa on 5/15/2016.
 */
export declare function getProxy(entity: any): any;
export declare class ProxyGenerator {
    static functionSetupFieldProxy(entity: any, propertyName: string, fieldType: FieldType, RelatedEntityClass?: any): void;
    static getDefaultValue(fieldType: FieldType, RelatedEntityClass?: any): any;
    static setupProxy(entity: any): IProxiedEntity;
}
