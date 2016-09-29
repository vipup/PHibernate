import { IEntity, IQEntity, QEntity, QDateField, QStringField } from 'querydsl-typescript';
export interface IDeltaRecord extends IEntity {
    id?: string;
    createDeviceId?: string;
    createDateTime?: Date;
    createUserId?: string;
}
export declare class QDeltaRecord<IQ extends IQEntity> extends QEntity<QDeltaRecord<IQ>> {
    id: QStringField<QDeltaRecord<IQ>>;
    createDeviceId: QStringField<QDeltaRecord<IQ>>;
    createDateTime: QDateField<QDeltaRecord<IQ>>;
    createUserId: QStringField<QDeltaRecord<IQ>>;
    constructor(entityConstructor: {
        new (): any;
    }, entityName: string, alias: string);
    toJSON(): any;
}
