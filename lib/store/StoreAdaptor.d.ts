import { PHQuery } from "querydsl-typescript/lib/index";
import { Observable } from "rxjs/Observable";
/**
 * Created by Papa on 6/10/2016.
 */
export interface StoreSetupInfo {
    name: string;
}
export interface StoreAdaptor {
    initialize(setupInfo: StoreSetupInfo): Promise<any>;
    create<E>(entity: E): Promise<E>;
    delete<E>(entity: E): Promise<E>;
    searchOne<E>(entityClass: {
        new (): E;
    }, phQuery: PHQuery): Observable<E>;
    search<E>(entityClass: {
        new (): E;
    }, phQuery: PHQuery): Observable<E[]>;
    findOne<E>(entityClass: {
        new (): E;
    }, phQuery: PHQuery): Promise<E>;
    find<E>(entityClass: {
        new (): E;
    }, phQuery: PHQuery): Promise<E[]>;
    save<E>(entity: E): Promise<E>;
    update<E>(entity: E): Promise<E>;
}
