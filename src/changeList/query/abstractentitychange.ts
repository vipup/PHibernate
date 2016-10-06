
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
import {AbstractEntityChange} from '../model/abstractentitychange';
import {IDeltaRecord, QDeltaRecord} from './deltarecord';
import {PH} from '../../config/PH';
import {Observable, Subject} from 'rxjs';
import {ChangeGroup} from '../model/changegroup';
import {IChangeGroup, QChangeGroup} from './changegroup';

//Entity Query
export interface IAbstractEntityChange
    extends IDeltaRecord
{
		// Properties
    entityName?: string;
    changeType?: number;
    entityChangeIdInGroup?: number;

		// Relations
    changeGroup?: IChangeGroup

}


// Entity Query Implementation
export class QAbstractEntityChange<IQ extends IQEntity> extends QDeltaRecord<IQ>
{
	
	// Fields
	entityName = new QStringField<QAbstractEntityChange<IQ>>(this, <any>QAbstractEntityChange, 'AbstractEntityChange', 'entityName');
	changeType = new QNumberField<QAbstractEntityChange<IQ>>(this, <any>QAbstractEntityChange, 'AbstractEntityChange', 'changeType');
	entityChangeIdInGroup = new QNumberField<QAbstractEntityChange<IQ>>(this, <any>QAbstractEntityChange, 'AbstractEntityChange', 'entityChangeIdInGroup');

	// Relations
	changeGroup = new QRelation<QChangeGroup<IQ>, ChangeGroup, QAbstractEntityChange<any>>(this, <any>QAbstractEntityChange, RelationType.MANY_TO_ONE, 'ChangeGroup', 'changeGroup', ChangeGroup, QChangeGroup);

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

