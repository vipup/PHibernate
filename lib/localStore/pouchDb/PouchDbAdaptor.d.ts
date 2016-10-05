import { ILocalStoreAdaptor } from "../LocalStoreAdaptor";
import { PouchDbStoreSetupInfo } from "./PouchDbApi";
import { PHGraphQuery, IEntity, PouchDbGraphQuery, PHSQLDelete, PHSQLUpdate } from "querydsl-typescript";
import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';
import { LocalStoreType } from "../LocalStoreApi";
import { ChangeGroupApi } from "../../changeList/model/ChangeGroup";
import { EntityWhereChangeApi } from "../../changeList/model/EntityWhereChange";
import { EntityChangeApi } from "../../changeList/model/EntityChange";
/**
 * Created by Papa on 5/28/2016.
 */
export declare class PouchDbAdaptor implements ILocalStoreAdaptor {
    activeChangeGroup: ChangeGroupApi;
    localDB: pouchDB.IPouchDB;
    type: LocalStoreType;
    wrapInTransaction(callback: () => void): void;
    initialize(setupInfo: PouchDbStoreSetupInfo): Promise<any>;
    insert<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<EntityChangeApi>;
    create<E>(entityName: string, entity: E): Promise<EntityChangeApi>;
    delete<E>(entityName: string, entity: E): Promise<EntityChangeApi>;
    deleteWhere<IE extends IEntity>(entityName: string, phSqlDelete: PHSQLDelete<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    searchOne<IE extends IEntity, E>(entityName: string, phQuery: PHGraphQuery<IE>, subject?: Subject<E>): Observable<E>;
    search<IE extends IEntity, E>(entityName: string, phQuery: PHGraphQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    find<IE extends IEntity, E>(entityName: string, phQuery: PHGraphQuery<IE>): Promise<E[]>;
    processQuery<IE extends IEntity, E>(entityName: string, pouchDbQuery: PouchDbGraphQuery<IE>): Promise<E[]>;
    loadManyToOneRelation(childQuery: any, entityName: string, parentResults: any, propertyName: string): Promise<any[]>;
    loadOneToManyRelation(childQuery: any, entityName: string, parentResults: any, propertyName: string): Promise<any[]>;
    findOne<IE extends IEntity, E>(entityName: string, phQuery: PHGraphQuery<IE>): Promise<E>;
    save<E>(entityName: string, entity: E): Promise<EntityChangeApi>;
    update<E>(entityName: string, entity: E): Promise<EntityChangeApi>;
    updateWhere<IE extends IEntity>(entityName: string, phSqlUpdate: PHSQLUpdate<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
}
