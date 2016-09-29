import { ILocalStoreAdaptor } from "../localStore/LocalStoreAdaptor";
import { IOfflineDeltaStoreConfig } from "../config/OfflineDeltaStoreConfig";
import { IEntityChange } from "./model/EntityChange";
import { IChangeGroup } from "./model/ChangeGroup";
/**
 * Created by Papa on 5/31/2016.
 */
export interface IOfflineDeltaStore {
    config: IOfflineDeltaStoreConfig;
    addRemoteChanges(changeRecords: IChangeGroup[]): Promise<IChangeGroup[]>;
    addChange(changeRecord: IChangeGroup): Promise<IChangeGroup>;
    findChangesForEntitiesWithFieldsSinceTime(entityChanges: IEntityChange[]): Promise<IEntityChange[]>;
    findUnsyncedChanges(): Promise<IChangeGroup[]>;
    markChangesAsSynced(changeGroups: IChangeGroup[]): Promise<void>;
}
export declare function getOfflineDeltaStore(localStore: ILocalStoreAdaptor, offlineDeltaStoreConfig: IOfflineDeltaStoreConfig): IOfflineDeltaStore;
