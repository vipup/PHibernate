import { IEntity, PHQuery, QEntity, PHSQLQuery, SQLDialect } from "querydsl-typescript";
import { Observable, Subject } from "rxjs";
import { IdGenerator, IdGeneration } from "./IdGenerator";
import { IChangeGroup } from "../changeList/model/ChangeGroup";
import { IEntityChange } from "../changeList/model/EntityChange";
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
    protected currentChangeGroup: IChangeGroup;
    constructor(idGeneration: IdGeneration);
    private verifyChangeGroup();
    readonly activeChangeGroup: IChangeGroup;
    create<E>(entityName: string, entity: E, changeGroup: IChangeGroup): Promise<IEntityChange>;
    protected abstract createNative(qEntity: QEntity<any>, columnNames: string[], values: any[], cascadeRecords: CascadeRecord[], changeGroup: IChangeGroup): any;
    delete<E>(entityName: string, entity: E, changeGroup: IChangeGroup): Promise<IEntityChange>;
    protected abstract deleteNative(qEntity: QEntity<any>, entity: any, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: IChangeGroup): any;
    update<E>(entityName: string, entity: E, changeGroup: IChangeGroup): Promise<IEntityChange>;
    protected abstract updateNative(qEntity: QEntity<any>, columnNames: string[], values: any[], idProperty: string, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: IChangeGroup): any;
    find<E, IE extends IEntity>(entityName: string, phSqlQuery: PHSQLQuery<IE>): Promise<E[]>;
    protected abstract getDialect(): SQLDialect;
    protected abstract findNative(sqlQuery: string, parameters: any[]): Promise<any[]>;
    findOne<E, IE extends IEntity>(entityName: string, phSqlQuery: PHSQLQuery<IE>): Promise<E>;
    save<E>(entityName: string, entity: E, changeGroup: IChangeGroup): Promise<IEntityChange>;
    search<E, IE extends IEntity>(entityName: string, phSqlQuery: PHSQLQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    warn(message: string): void;
}
