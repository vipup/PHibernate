import {CascadeType, Column, Entity, OneToMany, Table} from "querydsl-typescript";
import {EntityChange, EntityChangeType, StubEntityChange, IEntityChange} from "./EntityChange";
import {DeltaRecord} from "./DeltaRecord";
import {AbstractFieldChange} from "./AbstractFieldChange";
import {IdGenerator} from "../../localStore/IdGenerator";
import {PlatformUtils} from "../../shared/PlatformUtils";
import {UserUtils} from "../../shared/UserUtils";
/**
 * Created by Papa on 9/15/2016.
 */

export enum SyncStatus {
	SYNCHRONIZED,
	CLIENT_CHANGES_SYNC_PENDING,
	REMOTE_CHANGES_SYNC_PENDING
}

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

	static getNewChangeGroup(
		type: string,
		idGenerator: IdGenerator
	): ChangeGroup {
		let changeGroup = new ChangeGroup();

		let createDate = new Date();
		let deviceId = PlatformUtils.getDeviceAddress();
		let userId = UserUtils.getUserId();

		changeGroup.type = type;
		changeGroup.createDateTime = createDate;
		changeGroup.createDeviceId = deviceId;
		changeGroup.createUserId = userId;
		changeGroup.numberOfEntitiesInGroup = 0;

		changeGroup.id = idGenerator.generateChangeGroupId(changeGroup);

		return changeGroup;
	}

	@Column({name: "TYPE"})
	type:string;

	@OneToMany({cascade: CascadeType.ALL, mappedBy: 'changeGroup'})
	entityChanges: EntityChange[] = [];

	@Column({name: "NUM_ENTITIES_IN_GROUP"})
	numberOfEntitiesInGroup: number = 0;

	@Column({name: "GROUP_INDEX_IN_MILLISECOND"})
	groupIndexInMillisecond: number;

	@Column({name: "SYNC_STATUS"})
	syncStatus: SyncStatus = SyncStatus.CLIENT_CHANGES_SYNC_PENDING;

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

export class StubChangeGroup implements IChangeGroup {

	addNewCreateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string,
		idGenerator: IdGenerator
	): IEntityChange {
		return new StubEntityChange();
	}

	addNewDeleteEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): IEntityChange {
		return new StubEntityChange();
	}

	addNewUpdateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): IEntityChange {
		return new StubEntityChange();
	}

}