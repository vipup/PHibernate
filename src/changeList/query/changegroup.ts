
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
import {ChangeGroup} from '../model/changegroup';
import {IDeltaRecord, QDeltaRecord} from './deltarecord';
import {PH} from '../../config/PH';
import {Observable, Subject} from 'rxjs';
import {EntityChange} from '../model/entitychange';
import {IEntityChange, QEntityChange} from './entitychange';
import {EntityWhereChange} from '../model/entitywherechange';
import {IEntityWhereChange, QEntityWhereChange} from './entitywherechange';

//Entity Query
export interface IChangeGroup
    extends IDeltaRecord
{
		// Properties
    type?: string;
    numberOfEntitiesInGroup?: number;
    groupIndexInMillisecond?: number;
    syncStatus?: number;

		// Relations
    entityChanges?: IEntityChange
    entityWhereChanges?: IEntityWhereChange

}


// Entity Query Implementation
export class QChangeGroup<IQ extends IQEntity> extends QDeltaRecord<IQ>
{
	static from = new QChangeGroup(ChangeGroup, 'ChangeGroup', 'ChangeGroup');  

	// Fields
	type = new QStringField<QChangeGroup<IQ>>(this, <any>QChangeGroup, 'ChangeGroup', 'type');
	numberOfEntitiesInGroup = new QNumberField<QChangeGroup<IQ>>(this, <any>QChangeGroup, 'ChangeGroup', 'numberOfEntitiesInGroup');
	groupIndexInMillisecond = new QNumberField<QChangeGroup<IQ>>(this, <any>QChangeGroup, 'ChangeGroup', 'groupIndexInMillisecond');
	syncStatus = new QNumberField<QChangeGroup<IQ>>(this, <any>QChangeGroup, 'ChangeGroup', 'syncStatus');

	// Relations
	entityChanges = new QRelation<QEntityChange<IQ>, EntityChange, QChangeGroup<any>>(this, <any>QChangeGroup, RelationType.ONE_TO_MANY, 'EntityChange', 'entityChanges', EntityChange, QEntityChange);
	entityWhereChanges = new QRelation<QEntityWhereChange<IQ>, EntityWhereChange, QChangeGroup<any>>(this, <any>QChangeGroup, RelationType.ONE_TO_MANY, 'EntityWhereChange', 'entityWhereChanges', EntityWhereChange, QEntityWhereChange);

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
		queryDefinition:PHRawSQLQuery<IChangeGroup>
	):Promise<ChangeGroup[]> {
			return await PH.entityManager.find<ChangeGroup, IChangeGroup>(ChangeGroup, queryDefinition);
	}

	static async findOne(
		queryDefinition:PHRawSQLQuery<IChangeGroup>
	):Promise<ChangeGroup> {
			return await PH.entityManager.findOne<ChangeGroup, IChangeGroup>(ChangeGroup, queryDefinition);
	}
	
	static search(
		entityClass: {new (): ChangeGroup},
		queryDefinition:PHRawSQLQuery<IChangeGroup>,
		subject?: Subject<ChangeGroup[]>
	): Observable<ChangeGroup[]> {
			return PH.entityManager.search<ChangeGroup, IChangeGroup>(ChangeGroup, queryDefinition, subject);
	}
	
	static searchOne(
		entityClass: {new (): ChangeGroup},
		queryDefinition:PHRawSQLQuery<IChangeGroup>,
		subject?: Subject<ChangeGroup>
	): Observable<ChangeGroup> {
			return PH.entityManager.searchOne<ChangeGroup, IChangeGroup>(ChangeGroup, queryDefinition, subject);
	}

	static async insert(
		entity: ChangeGroup
	):Promise<ChangeGroup> {
			return await PH.entityManager.insert<ChangeGroup>(ChangeGroup, entity);
	}

	static async create(
		entity: ChangeGroup
	):Promise<ChangeGroup> {
			return await PH.entityManager.create<ChangeGroup>(ChangeGroup, entity);
	}

	static async update(
		entity: ChangeGroup
	):Promise<ChangeGroup> {
			return await PH.entityManager.update<ChangeGroup>(ChangeGroup, entity);
	}
	
	static async updateWhere(
		phRawUpdate: PHRawSQLUpdate<IChangeGroup>
	): Promise<number> {
		return await PH.entityManager.updateWhere<ChangeGroup, IChangeGroup>(ChangeGroup, phRawUpdate);
	}

	static async delete(
		entity: ChangeGroup
	):Promise<ChangeGroup> {
			return await PH.entityManager.delete<ChangeGroup>(ChangeGroup, entity);
	}
	
	static async deleteWhere(
		phRawDelete: PHRawSQLDelete<IChangeGroup>
	): Promise<number> {
		return await PH.entityManager.deleteWhere<ChangeGroup, IChangeGroup>(ChangeGroup, phRawDelete);
	}

	static async save(
		entity: ChangeGroup
	):Promise<ChangeGroup> {
			return await PH.entityManager.save<ChangeGroup>(ChangeGroup, entity);
	}

}

PH.addQEntity(ChangeGroup, QChangeGroup.from);
