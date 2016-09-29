import { IQEntity, QStringField, QRelation } from 'querydsl-typescript';
import { IDeltaRecord, QDeltaRecord } from './deltarecord';
import { EntityChange } from '../model/entitychange';
import { IEntityChange, QEntityChange } from './entitychange';
export interface IAbstractFieldChange extends IDeltaRecord {
    propertyName?: string;
    entityChange?: IEntityChange;
}
export declare class QAbstractFieldChange<IQ extends IQEntity> extends QDeltaRecord<IQ> {
    propertyName: QStringField<QAbstractFieldChange<IQ>>;
    entityChange: QRelation<QEntityChange<IQ>, EntityChange, QAbstractFieldChange<any>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
}
