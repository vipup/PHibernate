
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
import {NumberFieldChange} from '../model/numberfieldchange.ts';
import {PH} from "../../config/PH";
import {Observable, Subject} from "rxjs";

//Entity Query
export interface INumberFieldChange
    extends IEntity
{
		// Properties
    newValue?: number;
    oldValue?: number;

		// Relations

}


// Entity Query Implementation
export class QNumberFieldChange extends QEntity<QNumberFieldChange>
{
	static q = new QNumberFieldChange(true);  

	// Static Field accessors
	static newValue = QNumberFieldChange.q.newValue;
	static oldValue = QNumberFieldChange.q.oldValue;

	// Static Relation accessors

	// Fields
	newValue = new QNumberField<QNumberFieldChange>(this, QNumberFieldChange, 'NumberFieldChange', 'newValue');
	oldValue = new QNumberField<QNumberFieldChange>(this, QNumberFieldChange, 'NumberFieldChange', 'oldValue');

	// Relations

	constructor(
		isTemplate:boolean = false
	) {
		super(NumberFieldChange, 'NumberFieldChange', 'NumberFieldChange');
	}

	toJSON():any {
		throw 'Not Implemented';
	}

	static async find(
		queryDefinition:PHRawSQLQuery<INumberFieldChange>
	):Promise<NumberFieldChange[]> {
			return await PH.entityManager.find<NumberFieldChange, INumberFieldChange>(NumberFieldChange, queryDefinition);
	}

	static async findOne(
		queryDefinition:PHRawSQLQuery<INumberFieldChange>
	):Promise<NumberFieldChange> {
			return await PH.entityManager.findOne<NumberFieldChange, INumberFieldChange>(NumberFieldChange, queryDefinition);
	}
	
	static search(
		entityClass: {new (): NumberFieldChange},
		queryDefinition:PHRawSQLQuery<INumberFieldChange>,
		subject?: Subject<NumberFieldChange[]>
	): Observable<NumberFieldChange[]> {
			return PH.entityManager.search<NumberFieldChange, INumberFieldChange>(NumberFieldChange, queryDefinition, subject);
	}
	
	static searchOne(
		entityClass: {new (): NumberFieldChange},
		queryDefinition:PHRawSQLQuery<INumberFieldChange>,
		subject?: Subject<NumberFieldChange>
	): Observable<NumberFieldChange> {
			return PH.entityManager.searchOne<NumberFieldChange, INumberFieldChange>(NumberFieldChange, queryDefinition, subject);
	}

	static async create(
		entity: NumberFieldChange
	):Promise<NumberFieldChange> {
			return await PH.entityManager.create<NumberFieldChange>(NumberFieldChange, entity);
	}

	static async update(
		entity: NumberFieldChange
	):Promise<NumberFieldChange> {
			return await PH.entityManager.update<NumberFieldChange>(NumberFieldChange, entity);
	}

	static async delete(
		entity: NumberFieldChange
	):Promise<NumberFieldChange> {
			return await PH.entityManager.delete<NumberFieldChange>(NumberFieldChange, entity);
	}

	static async save(
		entity: NumberFieldChange
	):Promise<NumberFieldChange> {
			return await PH.entityManager.save<NumberFieldChange>(NumberFieldChange, entity);
	}
	
}

PH.addQEntity(NumberFieldChange, QNumberFieldChange.q);
