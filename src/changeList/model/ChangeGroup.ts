import {CascadeType, Column, Entity, OneToMany, Table} from "querydsl-typescript";
import {EntityChange, EntityChangeType, StubEntityChange, IEntityChange} from "./EntityChange";
import {DeltaRecord} from "./DeltaRecord";
import {AbstractFieldChange} from "./AbstractFieldChange";
import {IdGenerator} from "../../localStore/IdGenerator";
/**
 * Created by Papa on 9/15/2016.
 */

export interface IChangeGroup {
	addNewCreateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string,
		idGenerator: IdGenerator
	): IEntityChange;

	addNewDeleteEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): IEntityChange;

	addNewUpdateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): IEntityChange;
}

@Entity()
@Table({name: "CHANGE_GROUP"})
export class ChangeGroup extends DeltaRecord implements IChangeGroup {

	@Column({name: "TYPE"})
	type;

	@OneToMany({cascade: CascadeType.ALL, mappedBy: 'changeGroup'})
	entityChanges: EntityChange[] = [];

	@Column({name: "NUM_ENTITIES_IN_GROUP"})
	numberOfEntitiesInGroup: number = 0;

	@Column({name: "GROUP_INDEX_IN_MILLISECOND"})
	groupIndexInMillisecond: number;

	addNewCreateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string,
		idGenerator: IdGenerator
	): IEntityChange {
		if (entity instanceof ChangeGroup || entity instanceof EntityChange || entity instanceof AbstractFieldChange) {
			return new StubEntityChange();
		}
		let entityChange = this.addNewEntityChange(entityName);
		entityChange.changeType = EntityChangeType.CREATE;

		entity[idProperty] = entityChange.changedEntityId = idGenerator.generateEntityId(entity, entityChange);

		return entityChange;
	}

	addNewDeleteEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): IEntityChange {
		if (entity instanceof ChangeGroup || entity instanceof EntityChange || entity instanceof AbstractFieldChange) {
			return new StubEntityChange();
		}

		let entityChange = this.addNewEntityChange(entityName);
		entityChange.changeType = EntityChangeType.DELETE;
		entityChange.changedEntityId = entity[idProperty];

		return entityChange;
	}

	addNewUpdateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): IEntityChange {
		if (entity instanceof ChangeGroup || entity instanceof EntityChange || entity instanceof AbstractFieldChange) {
			return new StubEntityChange();
		}

		let entityChange = this.addNewEntityChange(entityName);
		entityChange.changeType = EntityChangeType.UPDATE;
		entityChange.changedEntityId = entity[idProperty];

		return entityChange;
	}

	private addNewEntityChange(
		entityName: string
	): EntityChange {
		let entityChange = new EntityChange();
		entityChange.entityChangeIdInGroup = ++this.numberOfEntitiesInGroup;
		this.entityChanges.push(entityChange);

		entityChange.changeGroup = this;
		entityChange.createDateTime = this.createDateTime;
		entityChange.createDeviceId = this.createDeviceId;
		entityChange.createUserId = this.createUserId;
		entityChange.entityName = entityName;
		entityChange.id = EntityChange.getEntityChangeId(entityChange.entityChangeIdInGroup, this.createDeviceId,
			this.createDateTime, this.createUserId, this.groupIndexInMillisecond);
		entityChange.numberOfFieldsInEntity = 0;

		return entityChange;
	}
}