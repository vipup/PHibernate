
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
import {IAbstractFieldChange, QAbstractFieldChange} from './abstractfieldchange.ts';
import {PH} from '../../config/PH';
import {Observable, Subject} from 'rxjs';

//Entity Query
export interface INumberFieldChange
    extends IAbstractFieldChange
{
		// Properties
    newValue?: number;
    oldValue?: number;

		// Relations

}


// Entity Query Implementation
export class QNumberFieldChange<IQ extends IQEntity> extends QAbstractFieldChange<IQ>
{
	static from = new QNumberFieldChange(NumberFieldChange, 'NumberFieldChange', 'NumberFieldChange');  

	// Fields
	newValue = new QNumberField<QNumberFieldChange<IQ>>(this, <any>QNumberFieldChange, 'NumberFieldChange', 'newValue');
	oldValue = new QNumberField<QNumberFieldChange<IQ>>(this, <any>QNumberFieldChange, 'NumberFieldChange', 'oldValue');

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

PH.addQEntity(NumberFieldChange, QNumberFieldChange.from);
