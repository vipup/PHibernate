/**
 * Created by Papa on 5/23/2016.
 */
import { IDeltaStore, IOfflineDeltaStore } from "../../changeList/DeltaStore";
import { IPersistenceConfig } from "../../config/PersistenceConfig";
import { LocalStoreAdaptor } from "../../localStore/LocalStoreAdaptor";
import { IEntity, CascadeType, PHRawSQLQuery, PHSQLQuery } from "querydsl-typescript";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
export interface IEntityManager {
    goOffline(): void;
    goOnline(): Promise<any>;
    initialize(): Promise<any>;
    isOnline(): boolean;
    create<E>(entityClass: {
        new (): E;
    }, entity: E, cascade?: CascadeType): Promise<E>;
    delete<E>(entityClass: {
        new (): E;
    }, entity: E, cascade?: CascadeType): Promise<E>;
    find<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E[]>;
    findOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E>;
    initialize(): Promise<any>;
    save<E>(entityClass: {
        new (): E;
    }, entity: E, cascade?: CascadeType): Promise<E>;
    search<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE, subject?: Subject<E>): Observable<E>;
    update<E>(entityClass: {
        new (): E;
    }, entity: E, cascade?: CascadeType): Promise<E>;
}
export declare class EntityManager implements IEntityManager {
    config: IPersistenceConfig;
    deltaStore: IDeltaStore;
    online: boolean;
    offlineDeltaStore: IOfflineDeltaStore;
    localStore: LocalStoreAdaptor;
    constructor(config: IPersistenceConfig);
    getLocalStore(localStoreTypeName?: string): LocalStoreAdaptor;
    initialize(): Promise<any>;
    goOffline(): void;
    goOnline(): Promise<any>;
    isOnline(): boolean;
    create<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    delete<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    save<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    update<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    private persistEntity<E>(entityClass, entity, operation);
    private ensureId<E>(entity);
    search<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phRawQuery: PHRawSQLQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phRawQuery: PHRawSQLQuery<IE>, subject?: Subject<E>): Observable<E>;
    find<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phRawQuery: PHRawSQLQuery<IE>): Promise<E[]>;
    findOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phRawQuery: PHRawSQLQuery<IE>): Promise<E>;
    getPHSQLQuery<E, IE extends IEntity>(qEntity: any, phRawQuery: PHRawSQLQuery<IE>): PHSQLQuery<IE>;
}
