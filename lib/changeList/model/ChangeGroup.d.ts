import { PHJsonSQLDelete, IEntity, PHJsonSQLUpdate } from "querydsl-typescript";
import { EntityChange, IEntityChange } from "./EntityChange";
import { DeltaRecord, DeltaRecordApi } from "./DeltaRecord";
import { IdGenerator } from "../../localStore/IdGenerator";
import { EntityWhereChange, IEntityWhereChange } from "./EntityWhereChange";
/**
 * Created by Papa on 9/15/2016.
 */
export declare enum SyncStatus {
    SYNCHRONIZED = 0,
    CLIENT_CHANGES_SYNC_PENDING = 1,
    REMOTE_CHANGES_SYNC_PENDING = 2,
}
export interface ChangeGroupApi extends DeltaRecordApi {
    entityChanges: EntityChange[];
    groupIndexInMillisecond: number;
    numberOfEntitiesInGroup: number;
    syncStatus: SyncStatus;
    type: string;
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): IEntityChange;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewDeleteWhereEntityChange<IE extends IEntity>(entityName: string, phJsonSqlDelete: PHJsonSQLDelete<IE>): IEntityWhereChange;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewUpdateWhereEntityChange<IE extends IEntity>(entityName: string, phJsonSqlUpdate: PHJsonSQLUpdate<IE>): IEntityWhereChange;
}
export declare class ChangeGroup extends DeltaRecord implements ChangeGroupApi {
    static getNewChangeGroup(type: string, idGenerator: IdGenerator): ChangeGroup;
    type: string;
    entityChanges: EntityChange[];
    entityWhereChanges: EntityWhereChange[];
    numberOfEntitiesInGroup: number;
    groupIndexInMillisecond: number;
    syncStatus: SyncStatus;
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): IEntityChange;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewDeleteWhereEntityChange<IE extends IEntity>(entityName: string, phJsonSqlDelete: PHJsonSQLDelete<IE>): IEntityWhereChange;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewUpdateWhereEntityChange<IE extends IEntity>(entityName: string, phJsonSqlUpdate: PHJsonSQLUpdate<IE>): IEntityWhereChange;
    private addNewEntityChange(entityName);
    private addNewEntityWhereChange(entityName);
    private setupAbstractEntityChange(entityName, abstractEntityChange);
}
export declare class StubChangeGroup implements ChangeGroupApi {
    id: string;
    createDateTime: Date;
    createDeviceId: string;
    createUserId: string;
    entityChanges: EntityChange[];
    groupIndexInMillisecond: number;
    numberOfEntitiesInGroup: number;
    syncStatus: SyncStatus;
    type: string;
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): IEntityChange;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewDeleteWhereEntityChange<IE extends IEntity>(entityName: string, phJsonSqlDelete: PHJsonSQLDelete<IE>): IEntityWhereChange;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewUpdateWhereEntityChange<IE extends IEntity>(entityName: string, phJsonSqlUpdate: PHJsonSQLUpdate<IE>): IEntityWhereChange;
}
