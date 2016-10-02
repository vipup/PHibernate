import { IOfflineDeltaStore } from "../../OfflineDeltaStore";
import { ILocalStoreAdaptor } from "../../../localStore/LocalStoreAdaptor";
import { ChangeGroupApi } from "../../model/ChangeGroup";
import { IOfflineDeltaStoreConfig } from "../../../config/OfflineDeltaStoreConfig";
import { IEntityChange } from "../../model/EntityChange";
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
export declare class OfflineSqlDeltaStore implements IOfflineDeltaStore {
    private localStore;
    config: IOfflineDeltaStoreConfig;
    constructor(localStore: ILocalStoreAdaptor, config: IOfflineDeltaStoreConfig);
    addRemoteChanges(changeGroups: ChangeGroupApi[]): Promise<ChangeGroupApi[]>;
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
    findChangesForEntitiesWithFieldsSinceTime(entityChanges: IEntityChange[]): Promise<IEntityChange[]>;
    findUnsyncedChanges(): Promise<ChangeGroupApi[]>;
    markChangesAsSynced(changeGroups: ChangeGroupApi[]): Promise<void>;
}
