
import {IEntity, IQEntity, IEntityQuery, QEntity, FieldType, 
		IQBooleanField, QBooleanField,
		IQDateField, QDateField,
		IQNumberField, QNumberField,
		IQStringField, QStringField,
		IBooleanOperation,JSONBooleanOperation,
		IDateOperation,JSONDateOperation,
		INumberOperation,JSONNumberOperation,
		IStringOperation,JSONStringOperation,
		PHRawSQLQuery,
		RelationType, IQRelation, QRelation} from 'querydsl-typescript';
import {DeltaRecord} from '../model/deltarecord.ts';
import {PH} from '../../config/PH';
import {Observable, Subject} from 'rxjs';

//Entity Query
export interface IDeltaRecord
    extends IEntity
{
		// Properties
    id?: string;
    createDeviceId?: string;
    createDateTime?: Date;
    createUserId?: string;

		// Relations

}


// Entity Query Implementation
export class QDeltaRecord<IQ extends IQEntity> extends QEntity<QDeltaRecord<IQ>>
{
	
	// Fields
	id = new QStringField<QDeltaRecord<IQ>>(this, <any>QDeltaRecord, 'DeltaRecord', 'id');
	createDeviceId = new QStringField<QDeltaRecord<IQ>>(this, <any>QDeltaRecord, 'DeltaRecord', 'createDeviceId');
	createDateTime = new QDateField<QDeltaRecord<IQ>>(this, <any>QDeltaRecord, 'DeltaRecord', 'createDateTime');
	createUserId = new QStringField<QDeltaRecord<IQ>>(this, <any>QDeltaRecord, 'DeltaRecord', 'createUserId');

	// Relations

	constructor(
	entityConstructor: {new(): any},
	  entityName: string,
		alias: string
	) {
		super(entityConstructor, entityName, alias);
	}

	toJSON():any {
		throw 'Not Implemented';
	}
	
}

