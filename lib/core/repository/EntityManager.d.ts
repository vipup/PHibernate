/**
 * Created by Papa on 5/23/2016.
 */
import { IDeltaStore } from "../../changeList/DeltaStore";
import { IPersistenceConfig } from "../../config/PersistenceConfig";
import { LocalStoreAdaptor } from "../../localStore/LocalStoreAdaptor";
import { IQEntity } from "querydsl-typescript/lib/index";
import { StoreAdaptor } from "../../store/StoreAdaptor";
export interface IEntityManager extends StoreAdaptor {
    goOffline(): void;
    goOnline(): Promise<any>;
    initialize(): Promise<any>;
    isOnline(): boolean;
}
export declare class EntityManager implements IEntityManager {
    config: IPersistenceConfig;
    deltaStoreMap: {
        [deltaStoreName: string]: IDeltaStore;
    };
    online: boolean;
    offlineDeltaStore: IDeltaStore;
    localStoreMap: {
        [localStoreTypeName: string]: LocalStoreAdaptor;
    };
    constructor(config: IPersistenceConfig);
    initialize(): Promise<any>;
    goOffline(): void;
    goOnline(): Promise<any>;
    isOnline(): boolean;
    create<E>(entity: E): Promise<E>;
    delete<E>(entity: E): Promise<E>;
    persist<E>(entity: E): Promise<E>;
    update<E>(entity: E): Promise<E>;
    private persistEntity<E>(entity, operation);
    query<E, IQE extends IQEntity<IQE>>(qEntity: IQE): Promise<E>;
}
