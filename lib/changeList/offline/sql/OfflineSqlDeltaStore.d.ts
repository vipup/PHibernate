import { IOfflineDeltaStore } from "../../OfflineDeltaStore";
import { ILocalStoreAdaptor } from "../../../localStore/LocalStoreAdaptor";
import { IChangeGroup } from "../../model/ChangeGroup";
import { IOfflineDeltaStoreConfig } from "../../../config/OfflineDeltaStoreConfig";
import { IEntityChange } from "../../model/EntityChange";
/**
 * Created by Papa on 9/24/2016.
 */
export declare class OfflineSqlDeltaStore implements IOfflineDeltaStore {
    private localStore;
    config: IOfflineDeltaStoreConfig;
    constructor(localStore: ILocalStoreAdaptor, config: IOfflineDeltaStoreConfig);
    addChange(changeRecord: IChangeGroup): Promise<IChangeGroup>;
    findChangesForEntitiesWithFieldsSinceTime(entityChanges: IEntityChange[]): Promise<IEntityChange[]>;
    findUnsyncedChanges(): Promise<IChangeGroup[]>;
    markChangesAsSynced(changeGroups: IChangeGroup[]): Promise<void>;
}
