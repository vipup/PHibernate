import { LocalStoreAdaptor } from "../LocalStoreAdaptor";
import { LocalStoreSetupInfo } from "../LocalStoreApi";
import { IEntity, PHQuery, QEntity, SQLDialect } from "querydsl-typescript";
import { Subject, Observable } from "rxjs";
import { IdGeneration } from "../IdGenerator";
import { SqlAdaptor, CascadeRecord } from "../SqlAdaptor";
export declare class WebSqlAdaptor extends SqlAdaptor implements LocalStoreAdaptor {
    static BACKUP_LOCAL: number;
    static BACKUP_LIBRARY: number;
    static BACKUP_DOCUMENTS: number;
    private _db;
    private currentTransaction;
    constructor(idGeneration: IdGeneration);
    private getBackupLocation(dbFlag);
    initialize(setupInfo: LocalStoreSetupInfo): Promise<any>;
    wrapInTransaction(callback: () => Promise<any>): Promise<any>;
    query(query: string, params?: any[], saveTransaction?: boolean): Promise<any>;
    protected getDialect(): SQLDialect;
    protected findNative(sqlQuery: string, parameters: any[]): Promise<any[]>;
    handleError(error: any): void;
    initTable(transaction: any, lastEntityName: any, resolve: any, reject: any): void;
    protected createNative(qEntity: QEntity<any>, columnNames: string[], values: any[], cascadeRecords: CascadeRecord[]): Promise<void>;
    protected deleteNative(qEntity: QEntity<any>, entity: any, idValue: number | string, cascadeRecords: CascadeRecord[], startNewTransaction?: boolean): Promise<void>;
    private convertValueIn(value);
    protected updateNative(qEntity: QEntity<any>, columnNames: string[], values: any[], idProperty: string, idValue: number | string, cascadeRecords: CascadeRecord[]): Promise<void>;
    search<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    warn(message: string): void;
}
