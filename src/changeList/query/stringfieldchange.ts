
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
import {StringFieldChange} from '../model/stringfieldchange.ts';
import {IAbstractFieldChange, QAbstractFieldChange} from './abstractfieldchange.ts';
import {PH} from "../../config/PH";
import {Observable, Subject} from 'rxjs';

//Entity Query
export interface IStringFieldChange
    extends IAbstractFieldChange
{
		// Properties
    newValue?: string;
    oldValue?: string;

		// Relations

}


// Entity Query Implementation
export class QStringFieldChange<IQ extends IQEntity> extends QAbstractFieldChange<IQ>
{
	static from = new QStringFieldChange(StringFieldChange, 'StringFieldChange', 'StringFieldChange');  

	// Fields
	newValue = new QStringField<QStringFieldChange<IQ>>(this, <any>QStringFieldChange, 'StringFieldChange', 'newValue');
	oldValue = new QStringField<QStringFieldChange<IQ>>(this, <any>QStringFieldChange, 'StringFieldChange', 'oldValue');

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
		subject?: Subject<StringFieldChange>
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

PH.addQEntity(StringFieldChange, QStringFieldChange.from);
