import { ILocalStoreAdaptor } from "../localStore/LocalStoreAdaptor";
import { IOfflineDeltaStoreConfig } from "../config/OfflineDeltaStoreConfig";
import { IEntityChange } from "./model/EntityChange";
import { ChangeGroupApi } from "./model/ChangeGroup";
/**
 * Created by Papa on 5/31/2016.
 */
export interface IOfflineDeltaStore {
    config: IOfflineDeltaStoreConfig;
    addRemoteChanges(changeRecords: ChangeGroupApi[]): Promise<void>;
    addChange(changeRecord: ChangeGroupApi): Promise<ChangeGroupApi>;
    findChangesForEntitiesWithFieldsSinceTime(entityChanges: IEntityChange[]): Promise<IEntityChange[]>;
    findUnsyncedChanges(): Promise<ChangeGroupApi[]>;
    markChangesAsSynced(changeGroups: ChangeGroupApi[]): Promise<void>;
}
export declare function getOfflineDeltaStore(localStore: ILocalStoreAdaptor, offlineDeltaStoreConfig: IOfflineDeltaStoreConfig): IOfflineDeltaStore;
