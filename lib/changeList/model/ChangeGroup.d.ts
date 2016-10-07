import { PHJsonSQLDelete, IEntity, PHJsonSQLUpdate } from "querydsl-typescript";
import { EntityChange, EntityChangeApi } from "./EntityChange";
import { DeltaRecord, DeltaRecordApi, StubDeltaRecord } from "./DeltaRecord";
import { IdGenerator } from "../../localStore/IdGenerator";
import { EntityWhereChange, EntityWhereChangeApi } from "./EntityWhereChange";
import { AbstractEntityChangeApi } from "./AbstractEntityChange";
/**
 * Created by Papa on 9/15/2016.
 */
export declare enum SyncStatus {
    SYNCHRONIZED = 0,
    CLIENT_CHANGES_SYNC_PENDING = 1,
    REMOTE_CHANGES_SYNC_PENDING = 2,
}
export interface ChangeGroupApi extends DeltaRecordApi {
    abstractEntityChanges?: AbstractEntityChangeApi[];
    entityChanges: EntityChangeApi[];
    entityWhereChanges: EntityWhereChangeApi[];
    groupIndexInMillisecond: number;
    numberOfEntitiesInGroup: number;
    syncStatus: SyncStatus;
    type: string;
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): EntityChangeApi;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): EntityChangeApi;
    addNewDeleteWhereEntityChange<IE extends IEntity>(entityName: string, numberOfAffectedRecords: number, phJsonSqlDelete: PHJsonSQLDelete<IE>): EntityWhereChangeApi;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): EntityChangeApi;
    addNewUpdateWhereEntityChange<IE extends IEntity>(entityName: string, numberOfAffectedRecords: number, phJsonSqlUpdate: PHJsonSQLUpdate<IE>): EntityWhereChangeApi;
}
export declare class ChangeGroup extends DeltaRecord implements ChangeGroupApi {
    static getNewChangeGroup(type: string, idGenerator: IdGenerator): ChangeGroup;
    type: string;
    entityChanges: EntityChange[];
    entityWhereChanges: EntityWhereChange[];
    numberOfEntitiesInGroup: number;
    groupIndexInMillisecond: number;
    syncStatus: SyncStatus;
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): EntityChangeApi;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): EntityChangeApi;
    addNewDeleteWhereEntityChange<IE extends IEntity>(entityName: string, numberOfAffectedRecords: number, phJsonSqlDelete: PHJsonSQLDelete<IE>): EntityWhereChangeApi;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): EntityChangeApi;
    addNewUpdateWhereEntityChange<IE extends IEntity>(entityName: string, numberOfAffectedRecords: number, phJsonSqlUpdate: PHJsonSQLUpdate<IE>): EntityWhereChangeApi;
    private addNewEntityChange(entityName);
    private addNewEntityWhereChange(entityName, numberOfAffectedRecords);
    private setupAbstractEntityChange(entityName, abstractEntityChange);
}
export declare class StubChangeGroup extends StubDeltaRecord implements ChangeGroupApi {
    entityChanges: EntityChange[];
    entityWhereChanges: EntityWhereChange[];
    groupIndexInMillisecond: number;
    numberOfEntitiesInGroup: number;
    syncStatus: SyncStatus;
    type: string;
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): EntityChangeApi;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): EntityChangeApi;
    addNewDeleteWhereEntityChange<IE extends IEntity>(entityName: string, numberOfAffectedRecords: number, phJsonSqlDelete: PHJsonSQLDelete<IE>): EntityWhereChangeApi;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): EntityChangeApi;
    addNewUpdateWhereEntityChange<IE extends IEntity>(entityName: string, numberOfAffectedRecords: number, phJsonSqlUpdate: PHJsonSQLUpdate<IE>): EntityWhereChangeApi;
}
