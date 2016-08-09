import { LocalStoreAdaptor } from "../LocalStoreAdaptor";
import { PouchDbStoreSetupInfo } from "./PouchDbApi";
import { PHQuery, PouchDbQuery } from "querydsl-typescript";
import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';
/**
 * Created by Papa on 5/28/2016.
 */
export declare class PouchDbAdaptor implements LocalStoreAdaptor {
    localDB: pouchDB.IPouchDB;
    initialize(setupInfo: PouchDbStoreSetupInfo): Promise<any>;
    create<E>(entity: E): Promise<E>;
    delete<E>(entity: E): Promise<E>;
    searchOne<E>(entityClass: {
        new (): E;
    }, phQuery: PHQuery, subject?: Subject<E>): Observable<E>;
    search<E>(entityClass: {
        new (): E;
    }, phQuery: PHQuery, subject?: Subject<E[]>): Observable<E[]>;
    find<E>(entityConstructor: {
        new (): E;
    }, phQuery: PHQuery): Promise<E[]>;
    processQuery<E>(entityConstructor: {
        new (): E;
    }, pouchDbQuery: PouchDbQuery): Promise<E[]>;
    loadManyToOneRelation(childQuery: any, entityName: string, parentResults: any, propertyName: string): Promise<any[]>;
    loadOneToManyRelation(childQuery: any, entityName: string, parentResults: any, propertyName: string): Promise<any[]>;
    findOne<E>(entityClass: {
        new (): E;
    }, phQuery: PHQuery): Promise<E>;
    save<E>(entity: E): Promise<E>;
    update<E>(entity: E): Promise<E>;
}
