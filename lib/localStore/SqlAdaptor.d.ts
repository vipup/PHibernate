import { IEntity, PHQuery, QEntity, PHSQLQuery, SQLDialect } from "querydsl-typescript";
import { Observable, Subject } from "rxjs";
import { IdGenerator, IdGeneration } from "./IdGenerator";
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
export declare abstract class SqlAdaptor {
    protected idGenerator: IdGenerator;
    constructor(idGeneration: IdGeneration);
    create<E>(entityName: string, entity: E): Promise<void>;
    protected abstract createNative(qEntity: QEntity<any>, columnNames: string[], values: any[], cascadeRecords: CascadeRecord[]): any;
    delete<E>(entityName: string, entity: E, startNewTransaction?: boolean): Promise<void>;
    protected abstract deleteNative(qEntity: QEntity<any>, entity: any, idValue: number | string, cascadeRecords: CascadeRecord[], startNewTransaction: boolean): any;
    update<E>(entityName: string, entity: E): Promise<void>;
    protected abstract updateNative(qEntity: QEntity<any>, columnNames: string[], values: any[], idProperty: string, idValue: number | string, cascadeRecords: CascadeRecord[]): any;
    find<E, IE extends IEntity>(entityName: string, phSqlQuery: PHSQLQuery<IE>): Promise<E[]>;
    protected abstract getDialect(): SQLDialect;
    protected abstract findNative(sqlQuery: string, parameters: any[]): Promise<any[]>;
    findOne<E, IE extends IEntity>(entityName: string, phSqlQuery: PHSQLQuery<IE>): Promise<E>;
    save<E>(entityName: string, entity: E): Promise<void>;
    search<E, IE extends IEntity>(entityName: string, phSqlQuery: PHSQLQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    warn(message: string): void;
}
