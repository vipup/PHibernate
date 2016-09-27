
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
import {StringFieldChange} from '../../../test/delta/model/stringfieldchange.ts';
import {PH, ProxyGenerator} from 'phibernate';

//Entity Query
export interface IStringFieldChange
    extends IEntity
{
		// Properties
    newValue?: string;
    oldValue?: string;

		// Relations

}


// Entity Query Implementation
export class QStringFieldChange extends QEntity<QStringFieldChange>
{
	static q = new QStringFieldChange(true);  

	// Static Field accessors
	static newValue = QStringFieldChange.q.newValue;
	static oldValue = QStringFieldChange.q.oldValue;

	// Static Relation accessors

	// Fields
	newValue = new QStringField<QStringFieldChange>(this, QStringFieldChange, 'StringFieldChange', 'newValue');
	oldValue = new QStringField<QStringFieldChange>(this, QStringFieldChange, 'StringFieldChange', 'oldValue');

	// Relations

	constructor(
		isTemplate:boolean = false
	) {
		super(StringFieldChange, 'StringFieldChange', 'StringFieldChange');
	}

	toJSON():any {
		throw 'Not Implemented';
	}

	static async find(
		queryDefinition:PHRawSQLQuery<IStringFieldChange>
	):Promise<StringFieldChange[]> {
			return await PH.entityManager.find<StringFieldChange, IStringFieldChange>(StringFieldChange, queryDefinition);
	}

	static async findOne(
		queryDefinition:PHRawSQLQuery<IStringFieldChange>
	):Promise<StringFieldChange> {
			return await PH.entityManager.findOne<StringFieldChange, IStringFieldChange>(StringFieldChange, queryDefinition);
	}
	
	static search(
		entityClass: {new (): StringFieldChange},
		queryDefinition:PHRawSQLQuery<IStringFieldChange>,
		subject?: Subject<StringFieldChange[]>
	): Observable<StringFieldChange[]> {
			return PH.entityManager.search<StringFieldChange, IStringFieldChange>(StringFieldChange, queryDefinition, subject);
	}
	
	static searchOne(
		entityClass: {new (): StringFieldChange},
		queryDefinition:PHRawSQLQuery<IStringFieldChange>,
		subject?: Subject<StringFieldChange[]>
	): Observable<StringFieldChange> {
			return PH.entityManager.searchOne<StringFieldChange, IStringFieldChange>(StringFieldChange, queryDefinition, subject);
	}

	static async create(
		entity: StringFieldChange
	):Promise<StringFieldChange> {
			return await PH.entityManager.create<StringFieldChange>(StringFieldChange, entity);
	}

	static async update(
		entity: StringFieldChange
	):Promise<StringFieldChange> {
			return await PH.entityManager.update<StringFieldChange>(StringFieldChange, entity);
	}

	static async delete(
		entity: StringFieldChange
	):Promise<StringFieldChange> {
			return await PH.entityManager.delete<StringFieldChange>(StringFieldChange, entity);
	}

	static async save(
		entity: StringFieldChange
	):Promise<StringFieldChange> {
			return await PH.entityManager.save<StringFieldChange>(StringFieldChange, entity);
	}
	
}

PH.addQEntity(StringFieldChange, QStringFieldChange.q);
