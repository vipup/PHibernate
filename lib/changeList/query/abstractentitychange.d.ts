import { IQEntity, QNumberField, QStringField, QRelation } from 'querydsl-typescript';
import { IDeltaRecord, QDeltaRecord } from './deltarecord';
import { ChangeGroup } from '../model/changegroup';
import { IChangeGroup, QChangeGroup } from './changegroup';
export interface IAbstractEntityChange extends IDeltaRecord {
    entityName?: string;
    changeType?: number;
    entityChangeIdInGroup?: number;
    changeGroup?: IChangeGroup;
}
export declare class QAbstractEntityChange<IQ extends IQEntity> extends QDeltaRecord<IQ> {
    entityName: QStringField<QAbstractEntityChange<IQ>>;
    changeType: QNumberField<QAbstractEntityChange<IQ>>;
    entityChangeIdInGroup: QNumberField<QAbstractEntityChange<IQ>>;
    changeGroup: QRelation<QChangeGroup<IQ>, ChangeGroup, QAbstractEntityChange<any>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
}
