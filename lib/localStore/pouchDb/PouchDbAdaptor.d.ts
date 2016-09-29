import { ILocalStoreAdaptor } from "../LocalStoreAdaptor";
import { PouchDbStoreSetupInfo } from "./PouchDbApi";
import { PHGraphQuery, IEntity, PouchDbGraphQuery } from "querydsl-typescript";
import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';
import { LocalStoreType } from "../LocalStoreApi";
import { ChangeGroupApi } from "../../changeList/model/ChangeGroup";
/**
 * Created by Papa on 5/28/2016.
 */
export declare class PouchDbAdaptor implements ILocalStoreAdaptor {
    activeChangeGroup: ChangeGroupApi;
    localDB: pouchDB.IPouchDB;
    type: LocalStoreType;
    wrapInTransaction(callback: () => void): void;
    initialize(setupInfo: PouchDbStoreSetupInfo): Promise<any>;
    create<E>(entityName: string, entity: E): Promise<E>;
    delete<E>(entityName: string, entity: E): Promise<E>;
    searchOne<IE extends IEntity, E>(entityName: string, phQuery: PHGraphQuery<IE>, subject?: Subject<E>): Observable<E>;
    search<IE extends IEntity, E>(entityName: string, phQuery: PHGraphQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    find<IE extends IEntity, E>(entityName: string, phQuery: PHGraphQuery<IE>): Promise<E[]>;
    processQuery<IE extends IEntity, E>(entityName: string, pouchDbQuery: PouchDbGraphQuery<IE>): Promise<E[]>;
    loadManyToOneRelation(childQuery: any, entityName: string, parentResults: any, propertyName: string): Promise<any[]>;
    loadOneToManyRelation(childQuery: any, entityName: string, parentResults: any, propertyName: string): Promise<any[]>;
    findOne<IE extends IEntity, E>(entityName: string, phQuery: PHGraphQuery<IE>): Promise<E>;
    save<E>(entityName: string, entity: E): Promise<E>;
    update<E>(entityName: string, entity: E): Promise<E>;
}
