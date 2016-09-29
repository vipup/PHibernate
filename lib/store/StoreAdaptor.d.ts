import { IEntity, PHQuery } from "querydsl-typescript";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { ChangeGroupApi } from "../changeList/model/ChangeGroup";
/**
 * Created by Papa on 6/10/2016.
 */
export interface StoreSetupInfo {
    name: string;
}
export interface IStoreAdaptor {
    activeChangeGroup: ChangeGroupApi;
    wrapInTransaction(callback: () => void): any;
    create<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<E>;
    delete<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<E>;
    find<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>): Promise<E[]>;
    findOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>): Promise<E>;
    initialize(setupInfo: StoreSetupInfo): Promise<any>;
    save<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<E>;
    search<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    update<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<E>;
}
