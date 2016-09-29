import { EntityChange, IEntityChange } from "./EntityChange";
import { DeltaRecord, DeltaRecordApi } from "./DeltaRecord";
import { IdGenerator } from "../../localStore/IdGenerator";
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
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
}
export declare class ChangeGroup extends DeltaRecord implements ChangeGroupApi {
    static getNewChangeGroup(type: string, idGenerator: IdGenerator): ChangeGroup;
    type: string;
    entityChanges: EntityChange[];
    numberOfEntitiesInGroup: number;
    groupIndexInMillisecond: number;
    syncStatus: SyncStatus;
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): IEntityChange;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    private addNewEntityChange(entityName);
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
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
}
