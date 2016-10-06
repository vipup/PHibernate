
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
import {EntityWhereChange} from '../model/entitywherechange';
import {IAbstractEntityChange, QAbstractEntityChange} from './abstractentitychange';
import {PH} from '../../config/PH';
import {Observable, Subject} from 'rxjs';

//Entity Query
export interface IEntityWhereChange
    extends IAbstractEntityChange
{
		// Properties
    numberOfAffectedRecords?: number;
    queryJson?: string;

		// Relations

}


// Entity Query Implementation
export class QEntityWhereChange<IQ extends IQEntity> extends QAbstractEntityChange<IQ>
{
	static from = new QEntityWhereChange(EntityWhereChange, 'EntityWhereChange', 'EntityWhereChange');  

	// Fields
	numberOfAffectedRecords = new QNumberField<QEntityWhereChange<IQ>>(this, <any>QEntityWhereChange, 'EntityWhereChange', 'numberOfAffectedRecords');
	queryJson = new QStringField<QEntityWhereChange<IQ>>(this, <any>QEntityWhereChange, 'EntityWhereChange', 'queryJson');

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
		queryDefinition:PHRawSQLQuery<IEntityWhereChange>
	):Promise<EntityWhereChange[]> {
			return await PH.entityManager.find<EntityWhereChange, IEntityWhereChange>(EntityWhereChange, queryDefinition);
	}

	static async findOne(
		queryDefinition:PHRawSQLQuery<IEntityWhereChange>
	):Promise<EntityWhereChange> {
			return await PH.entityManager.findOne<EntityWhereChange, IEntityWhereChange>(EntityWhereChange, queryDefinition);
	}
	
	static search(
		entityClass: {new (): EntityWhereChange},
		queryDefinition:PHRawSQLQuery<IEntityWhereChange>,
		subject?: Subject<EntityWhereChange[]>
	): Observable<EntityWhereChange[]> {
			return PH.entityManager.search<EntityWhereChange, IEntityWhereChange>(EntityWhereChange, queryDefinition, subject);
	}
	
	static searchOne(
		entityClass: {new (): EntityWhereChange},
		queryDefinition:PHRawSQLQuery<IEntityWhereChange>,
		subject?: Subject<EntityWhereChange>
	): Observable<EntityWhereChange> {
			return PH.entityManager.searchOne<EntityWhereChange, IEntityWhereChange>(EntityWhereChange, queryDefinition, subject);
	}

	static async insert(
		entity: EntityWhereChange
	):Promise<EntityWhereChange> {
			return await PH.entityManager.insert<EntityWhereChange>(EntityWhereChange, entity);
	}

	static async create(
		entity: EntityWhereChange
	):Promise<EntityWhereChange> {
			return await PH.entityManager.create<EntityWhereChange>(EntityWhereChange, entity);
	}

	static async update(
		entity: EntityWhereChange
	):Promise<EntityWhereChange> {
			return await PH.entityManager.update<EntityWhereChange>(EntityWhereChange, entity);
	}
	
	static async updateWhere(
		phRawUpdate: PHRawSQLUpdate<IEntityWhereChange>
	): Promise<number> {
		return await PH.entityManager.updateWhere<EntityWhereChange, IEntityWhereChange>(EntityWhereChange, phRawUpdate);
	}

	static async delete(
		entity: EntityWhereChange
	):Promise<EntityWhereChange> {
			return await PH.entityManager.delete<EntityWhereChange>(EntityWhereChange, entity);
	}
	
	static async deleteWhere(
		phRawDelete: PHRawSQLDelete<IEntityWhereChange>
	): Promise<number> {
		return await PH.entityManager.deleteWhere<EntityWhereChange, IEntityWhereChange>(EntityWhereChange, phRawDelete);
	}

	static async save(
		entity: EntityWhereChange
	):Promise<EntityWhereChange> {
			return await PH.entityManager.save<EntityWhereChange>(EntityWhereChange, entity);
	}

}

PH.addQEntity(EntityWhereChange, QEntityWhereChange.from);
