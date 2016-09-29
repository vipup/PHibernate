import { IOfflineDeltaStore } from "../../OfflineDeltaStore";
import { ILocalStoreAdaptor } from "../../../localStore/LocalStoreAdaptor";
import { ChangeGroupApi } from "../../model/ChangeGroup";
import { IOfflineDeltaStoreConfig } from "../../../config/OfflineDeltaStoreConfig";
import { IEntityChange } from "../../model/EntityChange";
/**
 * Created by Papa on 9/24/2016.
 */
export declare class OfflineSqlDeltaStore implements IOfflineDeltaStore {
    private localStore;
    config: IOfflineDeltaStoreConfig;
    constructor(localStore: ILocalStoreAdaptor, config: IOfflineDeltaStoreConfig);
    addRemoteChanges(changeRecords: ChangeGroupApi[]): Promise<ChangeGroupApi[]>;
    addChange(changeRecord: ChangeGroupApi): Promise<ChangeGroupApi>;
    findChangesForEntitiesWithFieldsSinceTime(entityChanges: IEntityChange[]): Promise<IEntityChange[]>;
    findUnsyncedChanges(): Promise<ChangeGroupApi[]>;
    markChangesAsSynced(changeGroups: ChangeGroupApi[]): Promise<void>;
}
