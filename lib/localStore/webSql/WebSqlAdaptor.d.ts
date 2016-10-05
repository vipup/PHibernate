import { LocalStoreSetupInfo } from "../LocalStoreApi";
import { IEntity, PHQuery, QEntity, SQLDialect, SQLStringDelete, SQLStringUpdate } from "querydsl-typescript";
import { Subject, Observable } from "rxjs";
import { IdGeneration } from "../IdGenerator";
import { SqlAdaptor, CascadeRecord } from "../SqlAdaptor";
import { ChangeGroupApi } from "../../changeList/model/ChangeGroup";
import { EntityChangeApi } from "../../changeList/model/EntityChange";
import { IEntityManager } from "../../core/repository/EntityManager";
import { EntityWhereChangeApi } from "../../changeList/model/EntityWhereChange";
export declare class WebSqlAdaptor extends SqlAdaptor {
    static BACKUP_LOCAL: number;
    static BACKUP_LIBRARY: number;
    static BACKUP_DOCUMENTS: number;
    private _db;
    private currentTransaction;
    constructor(entityManager: IEntityManager, idGeneration: IdGeneration);
    private getBackupLocation(dbFlag);
    initialize(setupInfo: LocalStoreSetupInfo): Promise<any>;
    wrapInTransaction(callback: () => Promise<any>): Promise<any>;
    query(query: string, params?: any[], saveTransaction?: boolean): Promise<any>;
    protected getDialect(): SQLDialect;
    protected findNative(sqlQuery: string, parameters: any[]): Promise<any[]>;
    handleError(error: any): void;
    initTable(transaction: any, lastEntityName: any, resolve: any, reject: any): void;
    protected createNative(qEntity: QEntity<any>, columnNames: string[], values: any[], cascadeRecords: CascadeRecord[], changeGroup: ChangeGroupApi): Promise<void>;
    protected insertNative(qEntity: QEntity<any>, columnNames: string[], values: any[]): Promise<void>;
    protected deleteNative(qEntity: QEntity<any>, entity: any, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: ChangeGroupApi): Promise<EntityChangeApi>;
    protected deleteWhereNative<IE extends IEntity>(sqlStringDelete: SQLStringDelete<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    private convertValueIn(value);
    protected updateNative(qEntity: QEntity<any>, columnNames: string[], values: any[], idProperty: string, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: ChangeGroupApi): Promise<void>;
    protected updateWhereNative<IE extends IEntity>(sqlStringUpdate: SQLStringUpdate<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    search<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    warn(message: string): void;
}
