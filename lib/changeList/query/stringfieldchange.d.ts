import { IQEntity, QStringField, PHRawSQLQuery } from 'querydsl-typescript';
import { StringFieldChange } from '../model/stringfieldchange';
import { IAbstractFieldChange, QAbstractFieldChange } from './abstractfieldchange';
import { Observable, Subject } from 'rxjs';
export interface IStringFieldChange extends IAbstractFieldChange {
    newValue?: string;
    oldValue?: string;
}
export declare class QStringFieldChange<IQ extends IQEntity> extends QAbstractFieldChange<IQ> {
    static from: QStringFieldChange<IQEntity>;
    newValue: QStringField<QStringFieldChange<IQ>>;
    oldValue: QStringField<QStringFieldChange<IQ>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
    static find(queryDefinition: PHRawSQLQuery<IStringFieldChange>): Promise<StringFieldChange[]>;
    static findOne(queryDefinition: PHRawSQLQuery<IStringFieldChange>): Promise<StringFieldChange>;
    static search(entityClass: {
        new (): StringFieldChange;
    }, queryDefinition: PHRawSQLQuery<IStringFieldChange>, subject?: Subject<StringFieldChange[]>): Observable<StringFieldChange[]>;
    static searchOne(entityClass: {
        new (): StringFieldChange;
    }, queryDefinition: PHRawSQLQuery<IStringFieldChange>, subject?: Subject<StringFieldChange>): Observable<StringFieldChange>;
    static create(entity: StringFieldChange): Promise<StringFieldChange>;
    static update(entity: StringFieldChange): Promise<StringFieldChange>;
    static delete(entity: StringFieldChange): Promise<StringFieldChange>;
    static save(entity: StringFieldChange): Promise<StringFieldChange>;
}
