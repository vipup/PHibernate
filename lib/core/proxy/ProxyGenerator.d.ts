import { EntityProxy } from "./Proxies";
import { FieldType, RelationType } from "querydsl-typescript";
/**
 * Created by Papa on 5/15/2016.
 */
export declare class ProxyGenerator {
    static setupEntityField(Class: any, propertyName: string, fieldType: FieldType): void;
    static setupEntityRelation(Class: any, propertyName: string, relationType: RelationType, RelatedEntityClass: any): void;
    static getDefaultFieldValue(fieldType: FieldType): any;
    static getDefaultRelationValue(relationType: RelationType, RelatedEntityClass: any): any;
    static setupProxy(entity: any): EntityProxy;
}
