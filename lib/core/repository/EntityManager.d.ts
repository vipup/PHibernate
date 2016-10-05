/**
 * Created by Papa on 5/23/2016.
 */
import { IDeltaStore } from "../../changeList/DeltaStore";
import { IPersistenceConfig } from "../../config/PersistenceConfig";
import { ILocalStoreAdaptor } from "../../localStore/LocalStoreAdaptor";
import { IOfflineDeltaStore } from "../../changeList/OfflineDeltaStore";
import { IEntity, PHRawSQLQuery, PHSQLQuery, PHRawSQLDelete, PHSQLDelete, PHRawSQLUpdate, PHSQLUpdate } from "querydsl-typescript";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
export interface IEntityManager {
    goOffline(): void;
    goOnline(): Promise<any>;
    initialize(): Promise<any>;
    isOnline(): boolean;
    insert<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    create<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    delete<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    deleteWhere<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phRawDelete: PHRawSQLDelete<IE>): Promise<number>;
    find<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E[]>;
    findOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E>;
    initialize(): Promise<any>;
    save<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    saveActiveChangeGroup(): Promise<void>;
    search<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE, subject?: Subject<E>): Observable<E>;
    update<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    updateWhere<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phRawUpdate: PHRawSQLUpdate<IE>): Promise<number>;
}
export declare class EntityManager implements IEntityManager {
    config: IPersistenceConfig;
    deltaStore: IDeltaStore;
    online: boolean;
    offlineDeltaStore: IOfflineDeltaStore;
    localStore: ILocalStoreAdaptor;
    constructor(config: IPersistenceConfig);
    getLocalStore(localStoreTypeName?: string): ILocalStoreAdaptor;
    initialize(): Promise<any>;
    goOffline(): void;
    goOnline(): Promise<any>;
    isOnline(): boolean;
    insert<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    create<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    delete<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    deleteWhere<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phRawDelete: PHRawSQLDelete<IE>): Promise<number>;
    getPHSQLDelete<E, IE extends IEntity>(qEntity: any, phRawDelete: PHRawSQLDelete<IE>): PHSQLDelete<IE>;
    save<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    update<E>(entityClass: {
        new (): E;
    }, entity: E): Promise<E>;
    updateWhere<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phRawUpdate: PHRawSQLUpdate<IE>): Promise<number>;
    getPHSQLUpdate<E, IE extends IEntity>(qEntity: any, phRawUpdate: PHRawSQLUpdate<IE>): PHSQLUpdate<IE>;
    private persistEntity<E>(entityClass, entity, operation);
    saveActiveChangeGroup(): Promise<void>;
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
