import { IQEntity, QBooleanField, PHRawSQLQuery, PHRawSQLUpdate, PHRawSQLDelete } from 'querydsl-typescript';
import { BooleanFieldChange } from '../model/booleanfieldchange';
import { IAbstractFieldChange, QAbstractFieldChange } from './abstractfieldchange';
import { Observable, Subject } from 'rxjs';
export interface IBooleanFieldChange extends IAbstractFieldChange {
    newValue?: boolean;
    oldValue?: boolean;
}
export declare class QBooleanFieldChange<IQ extends IQEntity> extends QAbstractFieldChange<IQ> {
    static from: QBooleanFieldChange<IQEntity>;
    newValue: QBooleanField<QBooleanFieldChange<IQ>>;
    oldValue: QBooleanField<QBooleanFieldChange<IQ>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
    static find(queryDefinition: PHRawSQLQuery<IBooleanFieldChange>): Promise<BooleanFieldChange[]>;
    static findOne(queryDefinition: PHRawSQLQuery<IBooleanFieldChange>): Promise<BooleanFieldChange>;
    static search(entityClass: {
        new (): BooleanFieldChange;
    }, queryDefinition: PHRawSQLQuery<IBooleanFieldChange>, subject?: Subject<BooleanFieldChange[]>): Observable<BooleanFieldChange[]>;
    static searchOne(entityClass: {
        new (): BooleanFieldChange;
    }, queryDefinition: PHRawSQLQuery<IBooleanFieldChange>, subject?: Subject<BooleanFieldChange>): Observable<BooleanFieldChange>;
    static insert(entity: BooleanFieldChange): Promise<BooleanFieldChange>;
    static create(entity: BooleanFieldChange): Promise<BooleanFieldChange>;
    static update(entity: BooleanFieldChange): Promise<BooleanFieldChange>;
    static updateWhere(phRawUpdate: PHRawSQLUpdate<IBooleanFieldChange>): Promise<number>;
    static delete(entity: BooleanFieldChange): Promise<BooleanFieldChange>;
    static deleteWhere(phRawDelete: PHRawSQLDelete<IBooleanFieldChange>): Promise<number>;
    static save(entity: BooleanFieldChange): Promise<BooleanFieldChange>;
}
