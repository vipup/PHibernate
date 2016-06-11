/**
 * Created by Papa on 5/23/2016.
 */
import { IDeltaStore } from "../../changeList/DeltaStore";
import { IPersistenceConfig } from "../../config/PersistenceConfig";
import { LocalStoreAdaptor } from "../../localStore/LocalStoreAdaptor";
import { IQEntity } from "querydsl-typescript/lib/index";
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
    initialize(): Promise<any>;
    goOnline(): Promise<any>;
    isExistingSetupInfo(): boolean;
    isOnline(): boolean;
    create<E>(entity: E): Promise<E>;
    delete<E>(entity: E): Promise<E>;
    persist<E>(entity: E): Promise<E>;
    update<E>(entity: E): Promise<E>;
    private persistEntity<E>(entity, operation);
    query<E, IQE extends IQEntity<IQE>>(qEntity: IQE): Promise<E>;
}
