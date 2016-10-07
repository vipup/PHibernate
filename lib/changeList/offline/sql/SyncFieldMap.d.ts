import { FieldMap, EntityFieldMap } from "querydsl-typescript";
/**
 * Created by Papa on 10/7/2016.
 */
export declare class SyncFieldMap extends FieldMap {
    ensureEntity(entityName: string): SyncEntityFieldMap;
}
export declare class SyncEntityFieldMap {
    entityFieldMap: EntityFieldMap;
    private entityName;
    constructor(entityFieldMap: EntityFieldMap, entityName: string);
    ensureField(propertyName: string): void;
    ensureRelation(propertyName: string): void;
}
