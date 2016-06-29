/**
 * Created by Papa on 5/23/2016.
 */
import { IDeltaStore } from "../../changeList/DeltaStore";
import { IPersistenceConfig } from "../../config/PersistenceConfig";
import { LocalStoreAdaptor } from "../../localStore/LocalStoreAdaptor";
import { IEntity, PHQuery } from "querydsl-typescript/lib/index";
import { Observable } from "rxjs/Observable";
import { CascadeRule } from "../../config/Rules";
export interface IEntityManager {
    goOffline(): void;
    goOnline(): Promise<any>;
    initialize(): Promise<any>;
    isOnline(): boolean;
    create<E>(entity: E, cascade?: CascadeRule): Promise<E>;
    delete<E>(entity: E, cascade?: CascadeRule): Promise<E>;
    find<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E[]>;
    findOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Promise<E>;
    initialize(): Promise<any>;
    search<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Observable<E[]>;
    save<E>(entity: E, cascade?: CascadeRule): Promise<E>;
    searchOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, iEntity: IE): Observable<E>;
    update<E>(entity: E, cascade?: CascadeRule): Promise<E>;
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
    create<E>(entity: E, cascadeRule?: CascadeRule): Promise<E>;
    delete<E>(entity: E, cascadeRule?: CascadeRule): Promise<E>;
    save<E>(entity: E, cascadeRule?: CascadeRule): Promise<E>;
    update<E>(entity: E, cascadeRule?: CascadeRule): Promise<E>;
    private persistEntity<E>(entity, operation, cascadeRule?);
    private ensureCascadeRule(cascadeRule, entityConfig);
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
