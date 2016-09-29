
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
import {BooleanFieldChange} from '../model/booleanfieldchange.ts';
import {IAbstractFieldChange, QAbstractFieldChange} from './abstractfieldchange.ts';
import {PH} from '../../config/PH';
import {Observable, Subject} from 'rxjs';

//Entity Query
export interface IBooleanFieldChange
    extends IAbstractFieldChange
{
		// Properties
    newValue?: boolean;
    oldValue?: boolean;

		// Relations

}


// Entity Query Implementation
export class QBooleanFieldChange<IQ extends IQEntity> extends QAbstractFieldChange<IQ>
{
	static from = new QBooleanFieldChange(BooleanFieldChange, 'BooleanFieldChange', 'BooleanFieldChange');  

	// Fields
	newValue = new QBooleanField<QBooleanFieldChange<IQ>>(this, <any>QBooleanFieldChange, 'BooleanFieldChange', 'newValue');
	oldValue = new QBooleanField<QBooleanFieldChange<IQ>>(this, <any>QBooleanFieldChange, 'BooleanFieldChange', 'oldValue');

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
		queryDefinition:PHRawSQLQuery<IBooleanFieldChange>
	):Promise<BooleanFieldChange[]> {
			return await PH.entityManager.find<BooleanFieldChange, IBooleanFieldChange>(BooleanFieldChange, queryDefinition);
	}

	static async findOne(
		queryDefinition:PHRawSQLQuery<IBooleanFieldChange>
	):Promise<BooleanFieldChange> {
			return await PH.entityManager.findOne<BooleanFieldChange, IBooleanFieldChange>(BooleanFieldChange, queryDefinition);
	}
	
	static search(
		entityClass: {new (): BooleanFieldChange},
		queryDefinition:PHRawSQLQuery<IBooleanFieldChange>,
		subject?: Subject<BooleanFieldChange[]>
	): Observable<BooleanFieldChange[]> {
			return PH.entityManager.search<BooleanFieldChange, IBooleanFieldChange>(BooleanFieldChange, queryDefinition, subject);
	}
	
	static searchOne(
		entityClass: {new (): BooleanFieldChange},
		queryDefinition:PHRawSQLQuery<IBooleanFieldChange>,
		subject?: Subject<BooleanFieldChange>
	): Observable<BooleanFieldChange> {
			return PH.entityManager.searchOne<BooleanFieldChange, IBooleanFieldChange>(BooleanFieldChange, queryDefinition, subject);
	}

	static async create(
		entity: BooleanFieldChange
	):Promise<BooleanFieldChange> {
			return await PH.entityManager.create<BooleanFieldChange>(BooleanFieldChange, entity);
	}

	static async update(
		entity: BooleanFieldChange
	):Promise<BooleanFieldChange> {
			return await PH.entityManager.update<BooleanFieldChange>(BooleanFieldChange, entity);
	}

	static async delete(
		entity: BooleanFieldChange
	):Promise<BooleanFieldChange> {
			return await PH.entityManager.delete<BooleanFieldChange>(BooleanFieldChange, entity);
	}

	static async save(
		entity: BooleanFieldChange
	):Promise<BooleanFieldChange> {
			return await PH.entityManager.save<BooleanFieldChange>(BooleanFieldChange, entity);
	}

}

PH.addQEntity(BooleanFieldChange, QBooleanFieldChange.from);
