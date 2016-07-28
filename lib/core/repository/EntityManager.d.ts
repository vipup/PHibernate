/**
 * Created by Papa on 5/23/2016.
 */
import { IDeltaStore } from "../../changeList/DeltaStore";
import { IPersistenceConfig } from "../../config/PersistenceConfig";
import { LocalStoreAdaptor } from "../../localStore/LocalStoreAdaptor";
import { IEntity, PHQuery } from "querydsl-typescript";
import { Observable } from "rxjs/Observable";
import { CascadeType } from "../../config/JPAApi";
export interface IEntityManager {
    goOffline(): void;
    goOnline(): Promise<any>;
    initialize(): Promise<any>;
    isOnline(): boolean;
    create<E>(entity: E, cascade?: CascadeType): Promise<E>;
    delete<E>(entity: E, cascade?: CascadeType): Promise<E>;
    find<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E[]>;
    findOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E>;
    initialize(): Promise<any>;
    save<E>(entity: E, cascade?: CascadeType): Promise<E>;
    search<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Observable<E>;
    update<E>(entity: E, cascade?: CascadeType): Promise<E>;
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
    create<E>(entity: E, cascadeRule?: CascadeType): Promise<E>;
    delete<E>(entity: E, cascadeRule?: CascadeType): Promise<E>;
    save<E>(entity: E, cascadeRule?: CascadeType): Promise<E>;
    update<E>(entity: E, cascadeRule?: CascadeType): Promise<E>;
    private persistEntity<E>(entity, operation, cascadeRule?);
    private ensureId<E>(entity);
    private setForeignKeys<E>(entity, cascadeRule?);
    search<IE extends IEntity>(entityClass: any, iEntity: IE): Observable<any[]>;
    searchOne<IE extends IEntity>(entityClass: any, iEntity: IE): Observable<any>;
    find<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E[]>;
    findOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E>;
    getPHQuery<E, IE extends IEntity>(qEntity: any, iEntity: IE): PHQuery;
}
