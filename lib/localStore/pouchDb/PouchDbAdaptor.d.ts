import { LocalStoreAdaptor } from "../LocalStoreAdaptor";
import { PouchDbStoreSetupInfo } from "./PouchDbApi";
import { PHGraphQuery, IEntity, PouchDbGraphQuery } from "querydsl-typescript";
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
    searchOne<IE extends IEntity, E>(entityClass: {
        new (): E;
    }, phQuery: PHGraphQuery<IE>, subject?: Subject<E>): Observable<E>;
    search<IE extends IEntity, E>(entityClass: {
        new (): E;
    }, phQuery: PHGraphQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    find<IE extends IEntity, E>(entityConstructor: {
        new (): E;
    }, phQuery: PHGraphQuery<IE>): Promise<E[]>;
    processQuery<IE extends IEntity, E>(entityConstructor: {
        new (): E;
    }, pouchDbQuery: PouchDbGraphQuery<IE>): Promise<E[]>;
    loadManyToOneRelation(childQuery: any, entityName: string, parentResults: any, propertyName: string): Promise<any[]>;
    loadOneToManyRelation(childQuery: any, entityName: string, parentResults: any, propertyName: string): Promise<any[]>;
    findOne<IE extends IEntity, E>(entityClass: {
        new (): E;
    }, phQuery: PHGraphQuery<IE>): Promise<E>;
    save<E>(entity: E): Promise<E>;
    update<E>(entity: E): Promise<E>;
}
