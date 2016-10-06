
import {IEntity, IQEntity, IEntityQuery, QEntity, FieldType, 
		IQBooleanField, QBooleanField,
		IQDateField, QDateField,
		IQNumberField, QNumberField,
		IQStringField, QStringField,
		IBooleanOperation, JSONBooleanOperation,
		IDateOperation, JSONDateOperation,
		INumberOperation, JSONNumberOperation,
		IStringOperation, JSONStringOperation,
		PHRawSQLQuery, PHRawSQLUpdate, PHRawSQLDelete,
		RelationType, IQRelation, QRelation} from 'querydsl-typescript';
import {AbstractFieldChange} from '../model/abstractfieldchange';
import {IDeltaRecord, QDeltaRecord} from './deltarecord';
import {PH} from '../../config/PH';
import {Observable, Subject} from 'rxjs';
import {EntityChange} from '../model/entitychange';
import {IEntityChange, QEntityChange} from './entitychange';

//Entity Query
export interface IAbstractFieldChange
    extends IDeltaRecord
{
		// Properties
    entityRelationName?: string;
    propertyName?: string;

		// Relations
    entityChange?: IEntityChange

}


// Entity Query Implementation
export class QAbstractFieldChange<IQ extends IQEntity> extends QDeltaRecord<IQ>
{
	
	// Fields
	entityRelationName = new QStringField<QAbstractFieldChange<IQ>>(this, <any>QAbstractFieldChange, 'AbstractFieldChange', 'entityRelationName');
	propertyName = new QStringField<QAbstractFieldChange<IQ>>(this, <any>QAbstractFieldChange, 'AbstractFieldChange', 'propertyName');

	// Relations
	entityChange = new QRelation<QEntityChange<IQ>, EntityChange, QAbstractFieldChange<any>>(this, <any>QAbstractFieldChange, RelationType.MANY_TO_ONE, 'EntityChange', 'entityChange', EntityChange, QEntityChange);

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

