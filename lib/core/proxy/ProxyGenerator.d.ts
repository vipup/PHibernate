import { EntityProxy } from "./Proxies";
import { FieldType } from "querydsl-typescript";
/**
 * Created by Papa on 5/15/2016.
 */
export declare class ProxyGenerator {
    static setupEntityField(Class: any, propertyName: string, fieldType: FieldType, RelatedEntityClass?: any): void;
    static getDefaultValue(fieldType: FieldType, RelatedEntityClass?: any): any;
    static setupProxy(entity: any): EntityProxy;
}
