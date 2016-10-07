import { IOfflineDeltaStore } from "../../OfflineDeltaStore";
import { ILocalStoreAdaptor } from "../../../localStore/LocalStoreAdaptor";
import { ChangeGroupApi } from "../../model/ChangeGroup";
import { IOfflineDeltaStoreConfig } from "../../../config/OfflineDeltaStoreConfig";
import { EntityChangeApi, EntityChange } from "../../model/EntityChange";
/**
 * Created by Papa on 9/24/2016.
 */
export declare enum ChangeGroupOrigin {
    LOCAL = 0,
    REMOTE = 1,
}
export interface ChangeGroupWithOrigin {
    changeGroup: ChangeGroupApi;
    origin: ChangeGroupOrigin;
}
export interface OrderedEntityChange {
    order: number;
    entityChange: EntityChange;
}
export declare class OfflineSqlDeltaStore implements IOfflineDeltaStore {
    private localStore;
    config: IOfflineDeltaStoreConfig;
    constructor(localStore: ILocalStoreAdaptor, config: IOfflineDeltaStoreConfig);
    /**
     * Remote updates (do not code any optimizations until there is a test suite in place)
     In a single Transaction:
     1)  Find all local change records for matching Entity Names since the time of first remote record
     2)  Filter out any remote changes that are already in the local store
     3)  Save remaining remote Change Groups
     4)  Add all local and remote changes into a single list and order
     5)  Prune all deleted entities from the point of their deletion forward
     6)  Re-execute all pruned ChangeGroups in order
     7)  Notify all matching attached queries of changes

     * @param changeGroups
     * @returns {ChangeGroupApi[]}
     */
    addRemoteChanges(changeGroups: ChangeGroupApi[]): Promise<void>;
    private executeCreate(entityChange, fieldMap, changeGroup);
    private addAllFieldChanges(entityChange, fieldMap);
    private addFieldChanges<FC>(fieldChanges, entityFieldMap, entity);
    private executeDelete(entityChange, fieldMap, changeGroup);
    private executeDeleteWhere(entityWhereChange, fieldMap, changeGroup);
    private executeUpdate(entityChange, fieldMap, changeGroup);
    private executeUpdateWhere(entityWhereChange, fieldMap, changeGroup);
    /**
     * Remove any modifications that were later updated by another change
     * @param changeGroups  remotely created change groups
     * @param localChangeGroups locally created change groups
     */
    private filterOutOverwrittenChanges(changeGroups, localChangeGroups);
    private sortChangeGroupsWithOrigin(cgo1, cgo2);
    private sortChangeGroups(cg1, cg2);
    private sortEntityChanges(ec1, ec2);
    addChange(changeRecord: ChangeGroupApi): Promise<ChangeGroupApi>;
    findChangesForEntitiesWithFieldsSinceTime(entityChanges: EntityChangeApi[]): Promise<EntityChangeApi[]>;
    findUnsyncedChanges(): Promise<ChangeGroupApi[]>;
    markChangesAsSynced(changeGroups: ChangeGroupApi[]): Promise<void>;
}
