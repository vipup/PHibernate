import { IQEntity, QNumberField, QStringField, PHRawSQLQuery, PHRawSQLUpdate, PHRawSQLDelete } from 'querydsl-typescript';
import { EntityWhereChange } from '../model/entitywherechange';
import { IAbstractEntityChange, QAbstractEntityChange } from './abstractentitychange';
import { Observable, Subject } from 'rxjs';
export interface IEntityWhereChange extends IAbstractEntityChange {
    numberOfAffectedRecords?: number;
    queryJson?: string;
}
export declare class QEntityWhereChange<IQ extends IQEntity> extends QAbstractEntityChange<IQ> {
    static from: QEntityWhereChange<IQEntity>;
    numberOfAffectedRecords: QNumberField<QEntityWhereChange<IQ>>;
    queryJson: QStringField<QEntityWhereChange<IQ>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
    static find(queryDefinition: PHRawSQLQuery<IEntityWhereChange>): Promise<EntityWhereChange[]>;
    static findOne(queryDefinition: PHRawSQLQuery<IEntityWhereChange>): Promise<EntityWhereChange>;
    static search(entityClass: {
        new (): EntityWhereChange;
    }, queryDefinition: PHRawSQLQuery<IEntityWhereChange>, subject?: Subject<EntityWhereChange[]>): Observable<EntityWhereChange[]>;
    static searchOne(entityClass: {
        new (): EntityWhereChange;
    }, queryDefinition: PHRawSQLQuery<IEntityWhereChange>, subject?: Subject<EntityWhereChange>): Observable<EntityWhereChange>;
    static insert(entity: EntityWhereChange): Promise<EntityWhereChange>;
    static create(entity: EntityWhereChange): Promise<EntityWhereChange>;
    static update(entity: EntityWhereChange): Promise<EntityWhereChange>;
    static updateWhere(phRawUpdate: PHRawSQLUpdate<IEntityWhereChange>): Promise<number>;
    static delete(entity: EntityWhereChange): Promise<EntityWhereChange>;
    static deleteWhere(phRawDelete: PHRawSQLDelete<IEntityWhereChange>): Promise<number>;
    static save(entity: EntityWhereChange): Promise<EntityWhereChange>;
}
