/**
 * Created by Papa on 5/23/2016.
 */
import { IDeltaStore } from "../../changeList/DeltaStore";
import { IPersistenceConfig } from "../../config/PersistenceConfig";
import { LocalStoreAdaptor } from "../../localStore/LocalStoreAdaptor";
export interface IEntityManager {
    save<E>(entity?: E): Promise<E>;
    delete<E>(entity: E): Promise<void>;
}
export declare class EntityManager {
    config: IPersistenceConfig;
    deltaStoreMap: {
        [deltaStoreName: string]: IDeltaStore;
    };
    offlineDeltaStore: IDeltaStore;
    localStoreMap: {
        [localStoreTypeName: string]: LocalStoreAdaptor;
    };
    constructor(config: IPersistenceConfig);
    if: any;
    initialize(): Promise<any>;
    isExistingSetupInfo(): boolean;
    save<E>(entity?: E): Promise<E>;
    delete<E>(entity: E): Promise<void>;
    private saveEntity<E>(entity);
    private saveEntityInChangeList(entityConfig);
}
