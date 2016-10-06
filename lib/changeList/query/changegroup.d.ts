import { IQEntity, QNumberField, QStringField, PHRawSQLQuery, PHRawSQLUpdate, PHRawSQLDelete, QRelation } from 'querydsl-typescript';
import { ChangeGroup } from '../model/changegroup';
import { IDeltaRecord, QDeltaRecord } from './deltarecord';
import { Observable, Subject } from 'rxjs';
import { EntityChange } from '../model/entitychange';
import { IEntityChange, QEntityChange } from './entitychange';
import { EntityWhereChange } from '../model/entitywherechange';
import { IEntityWhereChange, QEntityWhereChange } from './entitywherechange';
export interface IChangeGroup extends IDeltaRecord {
    type?: string;
    numberOfEntitiesInGroup?: number;
    groupIndexInMillisecond?: number;
    syncStatus?: number;
    entityChanges?: IEntityChange;
    entityWhereChanges?: IEntityWhereChange;
}
export declare class QChangeGroup<IQ extends IQEntity> extends QDeltaRecord<IQ> {
    static from: QChangeGroup<IQEntity>;
    type: QStringField<QChangeGroup<IQ>>;
    numberOfEntitiesInGroup: QNumberField<QChangeGroup<IQ>>;
    groupIndexInMillisecond: QNumberField<QChangeGroup<IQ>>;
    syncStatus: QNumberField<QChangeGroup<IQ>>;
    entityChanges: QRelation<QEntityChange<IQ>, EntityChange, QChangeGroup<any>>;
    entityWhereChanges: QRelation<QEntityWhereChange<IQ>, EntityWhereChange, QChangeGroup<any>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
    static find(queryDefinition: PHRawSQLQuery<IChangeGroup>): Promise<ChangeGroup[]>;
    static findOne(queryDefinition: PHRawSQLQuery<IChangeGroup>): Promise<ChangeGroup>;
    static search(entityClass: {
        new (): ChangeGroup;
    }, queryDefinition: PHRawSQLQuery<IChangeGroup>, subject?: Subject<ChangeGroup[]>): Observable<ChangeGroup[]>;
    static searchOne(entityClass: {
        new (): ChangeGroup;
    }, queryDefinition: PHRawSQLQuery<IChangeGroup>, subject?: Subject<ChangeGroup>): Observable<ChangeGroup>;
    static insert(entity: ChangeGroup): Promise<ChangeGroup>;
    static create(entity: ChangeGroup): Promise<ChangeGroup>;
    static update(entity: ChangeGroup): Promise<ChangeGroup>;
    static updateWhere(phRawUpdate: PHRawSQLUpdate<IChangeGroup>): Promise<number>;
    static delete(entity: ChangeGroup): Promise<ChangeGroup>;
    static deleteWhere(phRawDelete: PHRawSQLDelete<IChangeGroup>): Promise<number>;
    static save(entity: ChangeGroup): Promise<ChangeGroup>;
}
