import { IQEntity, QDateField, PHRawSQLQuery } from 'querydsl-typescript';
import { DateFieldChange } from '../model/datefieldchange';
import { IAbstractFieldChange, QAbstractFieldChange } from './abstractfieldchange';
import { Observable, Subject } from 'rxjs';
export interface IDateFieldChange extends IAbstractFieldChange {
    newValue?: Date;
    oldValue?: Date;
}
export declare class QDateFieldChange<IQ extends IQEntity> extends QAbstractFieldChange<IQ> {
    static from: QDateFieldChange<IQEntity>;
    newValue: QDateField<QDateFieldChange<IQ>>;
    oldValue: QDateField<QDateFieldChange<IQ>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
    static find(queryDefinition: PHRawSQLQuery<IDateFieldChange>): Promise<DateFieldChange[]>;
    static findOne(queryDefinition: PHRawSQLQuery<IDateFieldChange>): Promise<DateFieldChange>;
    static search(entityClass: {
        new (): DateFieldChange;
    }, queryDefinition: PHRawSQLQuery<IDateFieldChange>, subject?: Subject<DateFieldChange[]>): Observable<DateFieldChange[]>;
    static searchOne(entityClass: {
        new (): DateFieldChange;
    }, queryDefinition: PHRawSQLQuery<IDateFieldChange>, subject?: Subject<DateFieldChange>): Observable<DateFieldChange>;
    static create(entity: DateFieldChange): Promise<DateFieldChange>;
    static update(entity: DateFieldChange): Promise<DateFieldChange>;
    static delete(entity: DateFieldChange): Promise<DateFieldChange>;
    static save(entity: DateFieldChange): Promise<DateFieldChange>;
}
