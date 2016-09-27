
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
import {DateFieldChange} from '../../../test/delta/model/datefieldchange.ts';
import {PH, ProxyGenerator} from 'phibernate';

//Entity Query
export interface IDateFieldChange
    extends IEntity
{
		// Properties
    newValue?: Date;
    oldValue?: Date;

		// Relations

}


// Entity Query Implementation
export class QDateFieldChange extends QEntity<QDateFieldChange>
{
	static q = new QDateFieldChange(true);  

	// Static Field accessors
	static newValue = QDateFieldChange.q.newValue;
	static oldValue = QDateFieldChange.q.oldValue;

	// Static Relation accessors

	// Fields
	newValue = new QDateField<QDateFieldChange>(this, QDateFieldChange, 'DateFieldChange', 'newValue');
	oldValue = new QDateField<QDateFieldChange>(this, QDateFieldChange, 'DateFieldChange', 'oldValue');

	// Relations

	constructor(
		isTemplate:boolean = false
	) {
		super(DateFieldChange, 'DateFieldChange', 'DateFieldChange');
	}

	toJSON():any {
		throw 'Not Implemented';
	}

	static async find(
		queryDefinition:PHRawSQLQuery<IDateFieldChange>
	):Promise<DateFieldChange[]> {
			return await PH.entityManager.find<DateFieldChange, IDateFieldChange>(DateFieldChange, queryDefinition);
	}

	static async findOne(
		queryDefinition:PHRawSQLQuery<IDateFieldChange>
	):Promise<DateFieldChange> {
			return await PH.entityManager.findOne<DateFieldChange, IDateFieldChange>(DateFieldChange, queryDefinition);
	}
	
	static search(
		entityClass: {new (): DateFieldChange},
		queryDefinition:PHRawSQLQuery<IDateFieldChange>,
		subject?: Subject<DateFieldChange[]>
	): Observable<DateFieldChange[]> {
			return PH.entityManager.search<DateFieldChange, IDateFieldChange>(DateFieldChange, queryDefinition, subject);
	}
	
	static searchOne(
		entityClass: {new (): DateFieldChange},
		queryDefinition:PHRawSQLQuery<IDateFieldChange>,
		subject?: Subject<DateFieldChange[]>
	): Observable<DateFieldChange> {
			return PH.entityManager.searchOne<DateFieldChange, IDateFieldChange>(DateFieldChange, queryDefinition, subject);
	}

	static async create(
		entity: DateFieldChange
	):Promise<DateFieldChange> {
			return await PH.entityManager.create<DateFieldChange>(DateFieldChange, entity);
	}

	static async update(
		entity: DateFieldChange
	):Promise<DateFieldChange> {
			return await PH.entityManager.update<DateFieldChange>(DateFieldChange, entity);
	}

	static async delete(
		entity: DateFieldChange
	):Promise<DateFieldChange> {
			return await PH.entityManager.delete<DateFieldChange>(DateFieldChange, entity);
	}

	static async save(
		entity: DateFieldChange
	):Promise<DateFieldChange> {
			return await PH.entityManager.save<DateFieldChange>(DateFieldChange, entity);
	}
	
}

PH.addQEntity(DateFieldChange, QDateFieldChange.q);
