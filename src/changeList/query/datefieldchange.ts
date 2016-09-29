
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
import {DateFieldChange} from '../model/datefieldchange';
import {IAbstractFieldChange, QAbstractFieldChange} from './abstractfieldchange';
import {PH} from '../../config/PH';
import {Observable, Subject} from 'rxjs';

//Entity Query
export interface IDateFieldChange
    extends IAbstractFieldChange
{
		// Properties
    newValue?: Date;
    oldValue?: Date;

		// Relations

}


// Entity Query Implementation
export class QDateFieldChange<IQ extends IQEntity> extends QAbstractFieldChange<IQ>
{
	static from = new QDateFieldChange(DateFieldChange, 'DateFieldChange', 'DateFieldChange');  

	// Fields
	newValue = new QDateField<QDateFieldChange<IQ>>(this, <any>QDateFieldChange, 'DateFieldChange', 'newValue');
	oldValue = new QDateField<QDateFieldChange<IQ>>(this, <any>QDateFieldChange, 'DateFieldChange', 'oldValue');

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
		subject?: Subject<DateFieldChange>
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

PH.addQEntity(DateFieldChange, QDateFieldChange.from);
