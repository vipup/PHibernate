
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
import {ChangeGroup} from '../../../test/delta/model/changegroup.ts';
import {PH, ProxyGenerator} from 'phibernate';
import {EntityChange} from '../../../test/delta/model/entitychange.ts';
import {IEntityChange, QEntityChange} from './entitychange.ts';

//Entity Query
export interface IChangeGroup
    extends IEntity
{
		// Properties
    type?: string;
    numberOfEntitiesInGroup?: number;
    groupIndexInMillisecond?: number;
    syncStatus?: number;

		// Relations
    entityChanges?: IEntityChange

}


// Entity Query Implementation
export class QChangeGroup extends QEntity<QChangeGroup>
{
	static q = new QChangeGroup(true);  

	// Static Field accessors
	static type = QChangeGroup.q.type;
	static numberOfEntitiesInGroup = QChangeGroup.q.numberOfEntitiesInGroup;
	static groupIndexInMillisecond = QChangeGroup.q.groupIndexInMillisecond;
	static syncStatus = QChangeGroup.q.syncStatus;

	// Static Relation accessors
	static entityChanges = QChangeGroup.q.entityChanges;

	// Fields
	type = new QStringField<QChangeGroup>(this, QChangeGroup, 'ChangeGroup', 'type');
	numberOfEntitiesInGroup = new QNumberField<QChangeGroup>(this, QChangeGroup, 'ChangeGroup', 'numberOfEntitiesInGroup');
	groupIndexInMillisecond = new QNumberField<QChangeGroup>(this, QChangeGroup, 'ChangeGroup', 'groupIndexInMillisecond');
	syncStatus = new QNumberField<QChangeGroup>(this, QChangeGroup, 'ChangeGroup', 'syncStatus');

	// Relations
	entityChanges = new QRelation<QEntityChange, EntityChange, QChangeGroup>(this, QChangeGroup, RelationType.ONE_TO_MANY, 'EntityChange', 'entityChanges', EntityChange, QEntityChange);

	constructor(
		isTemplate:boolean = false
	) {
		super(ChangeGroup, 'ChangeGroup', 'ChangeGroup');
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
		subject?: Subject<ChangeGroup[]>
	): Observable<ChangeGroup> {
			return PH.entityManager.searchOne<ChangeGroup, IChangeGroup>(ChangeGroup, queryDefinition, subject);
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

	static async delete(
		entity: ChangeGroup
	):Promise<ChangeGroup> {
			return await PH.entityManager.delete<ChangeGroup>(ChangeGroup, entity);
	}

	static async save(
		entity: ChangeGroup
	):Promise<ChangeGroup> {
			return await PH.entityManager.save<ChangeGroup>(ChangeGroup, entity);
	}
	
}

PH.addQEntity(ChangeGroup, QChangeGroup.q);
