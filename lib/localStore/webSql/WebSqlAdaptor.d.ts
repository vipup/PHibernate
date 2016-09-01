import { LocalStoreAdaptor } from "../LocalStoreAdaptor";
import { LocalStoreSetupInfo } from "../LocalStoreApi";
import { IEntity, PHQuery } from "querydsl-typescript";
import { Subject, Observable } from "rxjs";
/**
 * Created by Papa on 8/30/2016.
 */
export declare class WebSqlAdaptor implements LocalStoreAdaptor {
    initialize(setupInfo: LocalStoreSetupInfo): Promise<any>;
    create<E>(entity: E): Promise<E>;
    delete<E>(entity: E): Promise<E>;
    find<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phQuery: PHQuery<IE>): Promise<E[]>;
    findOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phQuery: PHQuery<IE>): Promise<E>;
    save<E>(entity: E): Promise<E>;
    search<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phQuery: PHQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityClass: {
        new (): E;
    }, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    update<E>(entity: E): Promise<E>;
}
