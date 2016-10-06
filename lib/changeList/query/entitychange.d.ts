import { IQEntity, QNumberField, QStringField, PHRawSQLQuery, PHRawSQLUpdate, PHRawSQLDelete, QRelation } from 'querydsl-typescript';
import { EntityChange } from '../model/entitychange';
import { IAbstractEntityChange, QAbstractEntityChange } from './abstractentitychange';
import { Observable, Subject } from 'rxjs';
import { BooleanFieldChange } from '../model/booleanfieldchange';
import { IBooleanFieldChange, QBooleanFieldChange } from './booleanfieldchange';
import { DateFieldChange } from '../model/datefieldchange';
import { IDateFieldChange, QDateFieldChange } from './datefieldchange';
import { NumberFieldChange } from '../model/numberfieldchange';
import { INumberFieldChange, QNumberFieldChange } from './numberfieldchange';
import { StringFieldChange } from '../model/stringfieldchange';
import { IStringFieldChange, QStringFieldChange } from './stringfieldchange';
export interface IEntityChange extends IAbstractEntityChange {
    changedEntityId?: string;
    numberOfFieldsInEntity?: number;
    booleanFieldChanges?: IBooleanFieldChange;
    dateFieldChanges?: IDateFieldChange;
    numberFieldChanges?: INumberFieldChange;
    stringFieldChanges?: IStringFieldChange;
}
export declare class QEntityChange<IQ extends IQEntity> extends QAbstractEntityChange<IQ> {
    static from: QEntityChange<IQEntity>;
    changedEntityId: QStringField<QEntityChange<IQ>>;
    numberOfFieldsInEntity: QNumberField<QEntityChange<IQ>>;
    booleanFieldChanges: QRelation<QBooleanFieldChange<IQ>, BooleanFieldChange, QEntityChange<any>>;
    dateFieldChanges: QRelation<QDateFieldChange<IQ>, DateFieldChange, QEntityChange<any>>;
    numberFieldChanges: QRelation<QNumberFieldChange<IQ>, NumberFieldChange, QEntityChange<any>>;
    stringFieldChanges: QRelation<QStringFieldChange<IQ>, StringFieldChange, QEntityChange<any>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
    static find(queryDefinition: PHRawSQLQuery<IEntityChange>): Promise<EntityChange[]>;
    static findOne(queryDefinition: PHRawSQLQuery<IEntityChange>): Promise<EntityChange>;
    static search(entityClass: {
        new (): EntityChange;
    }, queryDefinition: PHRawSQLQuery<IEntityChange>, subject?: Subject<EntityChange[]>): Observable<EntityChange[]>;
    static searchOne(entityClass: {
        new (): EntityChange;
    }, queryDefinition: PHRawSQLQuery<IEntityChange>, subject?: Subject<EntityChange>): Observable<EntityChange>;
    static insert(entity: EntityChange): Promise<EntityChange>;
    static create(entity: EntityChange): Promise<EntityChange>;
    static update(entity: EntityChange): Promise<EntityChange>;
    static updateWhere(phRawUpdate: PHRawSQLUpdate<IEntityChange>): Promise<number>;
    static delete(entity: EntityChange): Promise<EntityChange>;
    static deleteWhere(phRawDelete: PHRawSQLDelete<IEntityChange>): Promise<number>;
    static save(entity: EntityChange): Promise<EntityChange>;
}
