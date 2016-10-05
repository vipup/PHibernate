import { IEntity, PHQuery, QEntity, PHSQLQuery, SQLDialect, SQLStringDelete, PHSQLDelete, PHSQLUpdate, SQLStringUpdate } from "querydsl-typescript";
import { Observable, Subject } from "rxjs";
import { IdGenerator, IdGeneration } from "./IdGenerator";
import { ChangeGroupApi } from "../changeList/model/ChangeGroup";
import { EntityChangeApi } from "../changeList/model/EntityChange";
import { IEntityManager } from "../core/repository/EntityManager";
import { LocalStoreType, LocalStoreSetupInfo } from "./LocalStoreApi";
import { ILocalStoreAdaptor } from "./LocalStoreAdaptor";
import { EntityWhereChangeApi } from "../changeList/model/EntityWhereChange";
/**
 * Created by Papa on 9/9/2016.
 */
export interface CascadeRecord {
    entityName: string;
    mappedBy: string;
    manyEntity: any;
    cascadeType: 'create' | 'remove' | 'update';
}
export interface RemovalRecord {
    array: any[];
    index: number;
}
export declare abstract class SqlAdaptor implements ILocalStoreAdaptor {
    protected entityManager: IEntityManager;
    type: LocalStoreType;
    protected idGenerator: IdGenerator;
    protected currentChangeGroup: ChangeGroupApi;
    constructor(entityManager: IEntityManager, idGeneration: IdGeneration);
    abstract initialize(setupInfo: LocalStoreSetupInfo): Promise<any>;
    abstract wrapInTransaction(callback: () => Promise<any>): Promise<any>;
    private verifyChangeGroup();
    readonly activeChangeGroup: ChangeGroupApi;
    create<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<EntityChangeApi>;
    protected abstract createNative(qEntity: QEntity<any>, columnNames: string[], values: any[], cascadeRecords: CascadeRecord[], changeGroup: ChangeGroupApi): any;
    insert<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<EntityChangeApi>;
    protected abstract insertNative(qEntity: QEntity<any>, columnNames: string[], values: any[]): any;
    delete<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<EntityChangeApi>;
    protected abstract deleteNative(qEntity: QEntity<any>, entity: any, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: ChangeGroupApi): any;
    deleteWhere<IE extends IEntity>(entityName: string, phSqlDelete: PHSQLDelete<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    protected abstract deleteWhereNative<IE extends IEntity>(sqlStringDelete: SQLStringDelete<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    update<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<EntityChangeApi>;
    protected abstract updateNative(qEntity: QEntity<any>, columnNames: string[], values: any[], idProperty: string, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: ChangeGroupApi): any;
    updateWhere<IE extends IEntity>(entityName: string, phSqlUpdate: PHSQLUpdate<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    protected abstract updateWhereNative<IE extends IEntity>(sqlStringUpdate: SQLStringUpdate<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    find<E, IE extends IEntity>(entityName: string, phSqlQuery: PHSQLQuery<IE>): Promise<E[]>;
    protected abstract getDialect(): SQLDialect;
    protected abstract findNative(sqlQuery: string, parameters: any[]): Promise<any[]>;
    findOne<E, IE extends IEntity>(entityName: string, phSqlQuery: PHSQLQuery<IE>): Promise<E>;
    save<E>(entityName: string, entity: E, changeGroup: ChangeGroupApi): Promise<EntityChangeApi>;
    search<E, IE extends IEntity>(entityName: string, phSqlQuery: PHSQLQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    warn(message: string): void;
}
