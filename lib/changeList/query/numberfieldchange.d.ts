import { IQEntity, QNumberField, PHRawSQLQuery } from 'querydsl-typescript';
import { NumberFieldChange } from '../model/numberfieldchange';
import { IAbstractFieldChange, QAbstractFieldChange } from './abstractfieldchange';
import { Observable, Subject } from 'rxjs';
export interface INumberFieldChange extends IAbstractFieldChange {
    newValue?: number;
    oldValue?: number;
}
export declare class QNumberFieldChange<IQ extends IQEntity> extends QAbstractFieldChange<IQ> {
    static from: QNumberFieldChange<IQEntity>;
    newValue: QNumberField<QNumberFieldChange<IQ>>;
    oldValue: QNumberField<QNumberFieldChange<IQ>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
    static find(queryDefinition: PHRawSQLQuery<INumberFieldChange>): Promise<NumberFieldChange[]>;
    static findOne(queryDefinition: PHRawSQLQuery<INumberFieldChange>): Promise<NumberFieldChange>;
    static search(entityClass: {
        new (): NumberFieldChange;
    }, queryDefinition: PHRawSQLQuery<INumberFieldChange>, subject?: Subject<NumberFieldChange[]>): Observable<NumberFieldChange[]>;
    static searchOne(entityClass: {
        new (): NumberFieldChange;
    }, queryDefinition: PHRawSQLQuery<INumberFieldChange>, subject?: Subject<NumberFieldChange>): Observable<NumberFieldChange>;
    static create(entity: NumberFieldChange): Promise<NumberFieldChange>;
    static update(entity: NumberFieldChange): Promise<NumberFieldChange>;
    static delete(entity: NumberFieldChange): Promise<NumberFieldChange>;
    static save(entity: NumberFieldChange): Promise<NumberFieldChange>;
}
