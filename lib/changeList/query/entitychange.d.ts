import { IQEntity, QNumberField, QStringField, PHRawSQLQuery, QRelation } from 'querydsl-typescript';
import { EntityChange } from '../model/entitychange';
import { IDeltaRecord, QDeltaRecord } from './deltarecord';
import { Observable, Subject } from 'rxjs';
import { BooleanFieldChange } from '../model/booleanfieldchange';
import { IBooleanFieldChange, QBooleanFieldChange } from './booleanfieldchange';
import { DateFieldChange } from '../model/datefieldchange';
import { IDateFieldChange, QDateFieldChange } from './datefieldchange';
import { NumberFieldChange } from '../model/numberfieldchange';
import { INumberFieldChange, QNumberFieldChange } from './numberfieldchange';
import { StringFieldChange } from '../model/stringfieldchange';
import { IStringFieldChange, QStringFieldChange } from './stringfieldchange';
import { ChangeGroup } from '../model/changegroup';
import { IChangeGroup, QChangeGroup } from './changegroup';
export interface IEntityChange extends IDeltaRecord {
    entityName?: string;
    changeType?: number;
    changedEntityId?: string;
    entityChangeIdInGroup?: number;
    numberOfFieldsInEntity?: number;
    booleanFieldChanges?: IBooleanFieldChange;
    dateFieldChanges?: IDateFieldChange;
    numberFieldChanges?: INumberFieldChange;
    stringFieldChanges?: IStringFieldChange;
    changeGroup?: IChangeGroup;
}
export declare class QEntityChange<IQ extends IQEntity> extends QDeltaRecord<IQ> {
    static from: QEntityChange<IQEntity>;
    entityName: QStringField<QEntityChange<IQ>>;
    changeType: QNumberField<QEntityChange<IQ>>;
    changedEntityId: QStringField<QEntityChange<IQ>>;
    entityChangeIdInGroup: QNumberField<QEntityChange<IQ>>;
    numberOfFieldsInEntity: QNumberField<QEntityChange<IQ>>;
    booleanFieldChanges: QRelation<QBooleanFieldChange<IQ>, BooleanFieldChange, QEntityChange<any>>;
    dateFieldChanges: QRelation<QDateFieldChange<IQ>, DateFieldChange, QEntityChange<any>>;
    numberFieldChanges: QRelation<QNumberFieldChange<IQ>, NumberFieldChange, QEntityChange<any>>;
    stringFieldChanges: QRelation<QStringFieldChange<IQ>, StringFieldChange, QEntityChange<any>>;
    changeGroup: QRelation<QChangeGroup<IQ>, ChangeGroup, QEntityChange<any>>;
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
    static create(entity: EntityChange): Promise<EntityChange>;
    static update(entity: EntityChange): Promise<EntityChange>;
    static delete(entity: EntityChange): Promise<EntityChange>;
    static save(entity: EntityChange): Promise<EntityChange>;
}
