
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
import {EntityChange} from '../model/entitychange';
import {IAbstractEntityChange, QAbstractEntityChange} from './abstractentitychange';
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

//Entity Query
export interface IEntityChange
    extends IAbstractEntityChange
{
		// Properties
    changedEntityId?: string;
    numberOfFieldsInEntity?: number;

		// Relations
    booleanFieldChanges?: IBooleanFieldChange
    dateFieldChanges?: IDateFieldChange
    numberFieldChanges?: INumberFieldChange
    stringFieldChanges?: IStringFieldChange

}


// Entity Query Implementation
export class QEntityChange<IQ extends IQEntity> extends QAbstractEntityChange<IQ>
{
	static from = new QEntityChange(EntityChange, 'EntityChange', 'EntityChange');  

	// Fields
	changedEntityId = new QStringField<QEntityChange<IQ>>(this, <any>QEntityChange, 'EntityChange', 'changedEntityId');
	numberOfFieldsInEntity = new QNumberField<QEntityChange<IQ>>(this, <any>QEntityChange, 'EntityChange', 'numberOfFieldsInEntity');

	// Relations
	booleanFieldChanges = new QRelation<QBooleanFieldChange<IQ>, BooleanFieldChange, QEntityChange<any>>(this, <any>QEntityChange, RelationType.ONE_TO_MANY, 'BooleanFieldChange', 'booleanFieldChanges', BooleanFieldChange, QBooleanFieldChange);
	dateFieldChanges = new QRelation<QDateFieldChange<IQ>, DateFieldChange, QEntityChange<any>>(this, <any>QEntityChange, RelationType.ONE_TO_MANY, 'DateFieldChange', 'dateFieldChanges', DateFieldChange, QDateFieldChange);
	numberFieldChanges = new QRelation<QNumberFieldChange<IQ>, NumberFieldChange, QEntityChange<any>>(this, <any>QEntityChange, RelationType.ONE_TO_MANY, 'NumberFieldChange', 'numberFieldChanges', NumberFieldChange, QNumberFieldChange);
	stringFieldChanges = new QRelation<QStringFieldChange<IQ>, StringFieldChange, QEntityChange<any>>(this, <any>QEntityChange, RelationType.ONE_TO_MANY, 'StringFieldChange', 'stringFieldChanges', StringFieldChange, QStringFieldChange);

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

	static async insert(
		entity: EntityChange
	):Promise<EntityChange> {
			return await PH.entityManager.insert<EntityChange>(EntityChange, entity);
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
	
	static async updateWhere(
		phRawUpdate: PHRawSQLUpdate<IEntityChange>
	): Promise<number> {
		return await PH.entityManager.updateWhere<EntityChange, IEntityChange>(EntityChange, phRawUpdate);
	}

	static async delete(
		entity: EntityChange
	):Promise<EntityChange> {
			return await PH.entityManager.delete<EntityChange>(EntityChange, entity);
	}
	
	static async deleteWhere(
		phRawDelete: PHRawSQLDelete<IEntityChange>
	): Promise<number> {
		return await PH.entityManager.deleteWhere<EntityChange, IEntityChange>(EntityChange, phRawDelete);
	}

	static async save(
		entity: EntityChange
	):Promise<EntityChange> {
			return await PH.entityManager.save<EntityChange>(EntityChange, entity);
	}

}

PH.addQEntity(EntityChange, QEntityChange.from);
