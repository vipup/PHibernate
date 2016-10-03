
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
import {EntityChange} from '../model/entitychange';
import {IDeltaRecord, QDeltaRecord} from './deltarecord';
import {PH} from '../../config/PH';
import {Observable, Subject} from 'rxjs';
import {BooleanFieldChange} from '../model/booleanfieldchange';
import {IBooleanFieldChange, QBooleanFieldChange} from './booleanfieldchange';
import {DateFieldChange} from '../model/datefieldchange';
import {IDateFieldChange, QDateFieldChange} from './datefieldchange';
import {NumberFieldChange} from '../model/numberfieldchange';
import {INumberFieldChange, QNumberFieldChange} from './numberfieldchange';
import {StringFieldChange} from '../model/stringfieldchange';
import {IStringFieldChange, QStringFieldChange} from './stringfieldchange';
import {ChangeGroup} from '../model/changegroup';
import {IChangeGroup, QChangeGroup} from './changegroup';

//Entity Query
export interface IEntityChange
    extends IDeltaRecord
{
		// Properties
    entityName?: string;
    changeType?: number;
    changedEntityId?: string;
    entityChangeIdInGroup?: number;
    numberOfFieldsInEntity?: number;

		// Relations
    booleanFieldChanges?: IBooleanFieldChange
    dateFieldChanges?: IDateFieldChange
    numberFieldChanges?: INumberFieldChange
    stringFieldChanges?: IStringFieldChange
    changeGroup?: IChangeGroup

}


// Entity Query Implementation
export class QEntityChange<IQ extends IQEntity> extends QDeltaRecord<IQ>
{
	static from = new QEntityChange(EntityChange, 'EntityChange', 'EntityChange');  

	// Fields
	entityName = new QStringField<QEntityChange<IQ>>(this, <any>QEntityChange, 'EntityChange', 'entityName');
	changeType = new QNumberField<QEntityChange<IQ>>(this, <any>QEntityChange, 'EntityChange', 'changeType');
	changedEntityId = new QStringField<QEntityChange<IQ>>(this, <any>QEntityChange, 'EntityChange', 'changedEntityId');
	entityChangeIdInGroup = new QNumberField<QEntityChange<IQ>>(this, <any>QEntityChange, 'EntityChange', 'entityChangeIdInGroup');
	numberOfFieldsInEntity = new QNumberField<QEntityChange<IQ>>(this, <any>QEntityChange, 'EntityChange', 'numberOfFieldsInEntity');

	// Relations
	booleanFieldChanges = new QRelation<QBooleanFieldChange<IQ>, BooleanFieldChange, QEntityChange<any>>(this, <any>QEntityChange, RelationType.ONE_TO_MANY, QNumberField, 'BooleanFieldChange', 'booleanFieldChanges', BooleanFieldChange, QBooleanFieldChange);
	dateFieldChanges = new QRelation<QDateFieldChange<IQ>, DateFieldChange, QEntityChange<any>>(this, <any>QEntityChange, RelationType.ONE_TO_MANY, QNumberField, 'DateFieldChange', 'dateFieldChanges', DateFieldChange, QDateFieldChange);
	numberFieldChanges = new QRelation<QNumberFieldChange<IQ>, NumberFieldChange, QEntityChange<any>>(this, <any>QEntityChange, RelationType.ONE_TO_MANY, QNumberField, 'NumberFieldChange', 'numberFieldChanges', NumberFieldChange, QNumberFieldChange);
	stringFieldChanges = new QRelation<QStringFieldChange<IQ>, StringFieldChange, QEntityChange<any>>(this, <any>QEntityChange, RelationType.ONE_TO_MANY, QNumberField, 'StringFieldChange', 'stringFieldChanges', StringFieldChange, QStringFieldChange);
	changeGroup = new QRelation<QChangeGroup<IQ>, ChangeGroup, QEntityChange<any>>(this, <any>QEntityChange, RelationType.MANY_TO_ONE, QNumberField, 'ChangeGroup', 'changeGroup', ChangeGroup, QChangeGroup);

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
	
			static async find(
		queryDefinition:PHRawSQLQuery<IEntityChange>
	):Promise<EntityChange[]> {
			return await PH.entityManager.find<EntityChange, IEntityChange>(EntityChange, queryDefinition);
	}

	static async findOne(
		queryDefinition:PHRawSQLQuery<IEntityChange>
	):Promise<EntityChange> {
			return await PH.entityManager.findOne<EntityChange, IEntityChange>(EntityChange, queryDefinition);
	}
	
	static search(
		entityClass: {new (): EntityChange},
		queryDefinition:PHRawSQLQuery<IEntityChange>,
		subject?: Subject<EntityChange[]>
	): Observable<EntityChange[]> {
			return PH.entityManager.search<EntityChange, IEntityChange>(EntityChange, queryDefinition, subject);
	}
	
	static searchOne(
		entityClass: {new (): EntityChange},
		queryDefinition:PHRawSQLQuery<IEntityChange>,
		subject?: Subject<EntityChange>
	): Observable<EntityChange> {
			return PH.entityManager.searchOne<EntityChange, IEntityChange>(EntityChange, queryDefinition, subject);
	}

	static async create(
		entity: EntityChange
	):Promise<EntityChange> {
			return await PH.entityManager.create<EntityChange>(EntityChange, entity);
	}

	static async update(
		entity: EntityChange
	):Promise<EntityChange> {
			return await PH.entityManager.update<EntityChange>(EntityChange, entity);
	}

	static async delete(
		entity: EntityChange
	):Promise<EntityChange> {
			return await PH.entityManager.delete<EntityChange>(EntityChange, entity);
	}

	static async save(
		entity: EntityChange
	):Promise<EntityChange> {
			return await PH.entityManager.save<EntityChange>(EntityChange, entity);
	}

}

PH.addQEntity(EntityChange, QEntityChange.from);
