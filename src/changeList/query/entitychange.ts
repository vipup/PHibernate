
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
import {EntityChange} from '../../../test/delta/model/entitychange.ts';
import {PH, ProxyGenerator} from 'phibernate';
import {BooleanFieldChange} from '../../../test/delta/model/booleanfieldchange.ts';
import {IBooleanFieldChange, QBooleanFieldChange} from './booleanfieldchange.ts';
import {DateFieldChange} from '../../../test/delta/model/datefieldchange.ts';
import {IDateFieldChange, QDateFieldChange} from './datefieldchange.ts';
import {NumberFieldChange} from '../../../test/delta/model/numberfieldchange.ts';
import {INumberFieldChange, QNumberFieldChange} from './numberfieldchange.ts';
import {StringFieldChange} from '../../../test/delta/model/stringfieldchange.ts';
import {IStringFieldChange, QStringFieldChange} from './stringfieldchange.ts';
import {ChangeGroup} from '../../../test/delta/model/changegroup.ts';
import {IChangeGroup, QChangeGroup} from './changegroup.ts';

//Entity Query
export interface IEntityChange
    extends IEntity
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
export class QEntityChange extends QEntity<QEntityChange>
{
	static q = new QEntityChange(true);  

	// Static Field accessors
	static entityName = QEntityChange.q.entityName;
	static changeType = QEntityChange.q.changeType;
	static changedEntityId = QEntityChange.q.changedEntityId;
	static entityChangeIdInGroup = QEntityChange.q.entityChangeIdInGroup;
	static numberOfFieldsInEntity = QEntityChange.q.numberOfFieldsInEntity;

	// Static Relation accessors
	static booleanFieldChanges = QEntityChange.q.booleanFieldChanges;
	static dateFieldChanges = QEntityChange.q.dateFieldChanges;
	static numberFieldChanges = QEntityChange.q.numberFieldChanges;
	static stringFieldChanges = QEntityChange.q.stringFieldChanges;
	static changeGroup = QEntityChange.q.changeGroup;

	// Fields
	entityName = new QStringField<QEntityChange>(this, QEntityChange, 'EntityChange', 'entityName');
	changeType = new QNumberField<QEntityChange>(this, QEntityChange, 'EntityChange', 'changeType');
	changedEntityId = new QStringField<QEntityChange>(this, QEntityChange, 'EntityChange', 'changedEntityId');
	entityChangeIdInGroup = new QNumberField<QEntityChange>(this, QEntityChange, 'EntityChange', 'entityChangeIdInGroup');
	numberOfFieldsInEntity = new QNumberField<QEntityChange>(this, QEntityChange, 'EntityChange', 'numberOfFieldsInEntity');

	// Relations
	booleanFieldChanges = new QRelation<QBooleanFieldChange, BooleanFieldChange, QEntityChange>(this, QEntityChange, RelationType.ONE_TO_MANY, 'BooleanFieldChange', 'booleanFieldChanges', BooleanFieldChange, QBooleanFieldChange);
	dateFieldChanges = new QRelation<QDateFieldChange, DateFieldChange, QEntityChange>(this, QEntityChange, RelationType.ONE_TO_MANY, 'DateFieldChange', 'dateFieldChanges', DateFieldChange, QDateFieldChange);
	numberFieldChanges = new QRelation<QNumberFieldChange, NumberFieldChange, QEntityChange>(this, QEntityChange, RelationType.ONE_TO_MANY, 'NumberFieldChange', 'numberFieldChanges', NumberFieldChange, QNumberFieldChange);
	stringFieldChanges = new QRelation<QStringFieldChange, StringFieldChange, QEntityChange>(this, QEntityChange, RelationType.ONE_TO_MANY, 'StringFieldChange', 'stringFieldChanges', StringFieldChange, QStringFieldChange);
	changeGroup = new QRelation<QChangeGroup, ChangeGroup, QEntityChange>(this, QEntityChange, RelationType.MANY_TO_ONE, 'ChangeGroup', 'changeGroup', ChangeGroup, QChangeGroup);

	constructor(
		isTemplate:boolean = false
	) {
		super(EntityChange, 'EntityChange', 'EntityChange');
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
		subject?: Subject<EntityChange[]>
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

PH.addQEntity(EntityChange, QEntityChange.q);
