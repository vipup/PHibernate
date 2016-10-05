import {
	CascadeType, Column, Entity, OneToMany, Table, PHJsonSQLDelete, IEntity,
	PHJsonSQLUpdate
} from "querydsl-typescript";
import {EntityChange, StubEntityChange, EntityChangeApi} from "./EntityChange";
import {DeltaRecord, DeltaRecordApi} from "./DeltaRecord";
import {AbstractFieldChange} from "./AbstractFieldChange";
import {IdGenerator} from "../../localStore/IdGenerator";
import {PlatformUtils} from "../../shared/PlatformUtils";
import {UserUtils} from "../../shared/UserUtils";
import {EntityWhereChange, StubWhereEntityChange, EntityWhereChangeApi} from "./EntityWhereChange";
import {EntityChangeType, AbstractEntityChange} from "./AbstractEntityChange";
/**
 * Created by Papa on 9/15/2016.
 */

export enum SyncStatus {
	SYNCHRONIZED,
	CLIENT_CHANGES_SYNC_PENDING,
	REMOTE_CHANGES_SYNC_PENDING
}

export interface ChangeGroupApi extends DeltaRecordApi {

	entityChanges: EntityChange[];
	groupIndexInMillisecond: number;
	numberOfEntitiesInGroup: number;
	syncStatus: SyncStatus;
	type: string;

	addNewCreateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string,
		idGenerator: IdGenerator
	): EntityChangeApi;

	addNewDeleteEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): EntityChangeApi;

	addNewDeleteWhereEntityChange<IE extends IEntity>(
		entityName: string,
		numberOfAffectedRecords: number,
		phJsonSqlDelete: PHJsonSQLDelete<IE>
	): EntityWhereChangeApi;

	addNewUpdateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): EntityChangeApi;

	addNewUpdateWhereEntityChange<IE extends IEntity>(
		entityName: string,
		numberOfAffectedRecords: number,
		phJsonSqlUpdate: PHJsonSQLUpdate<IE>
	): EntityWhereChangeApi;
}

@Entity()
@Table({name: "CHANGE_GROUP"})
export class ChangeGroup extends DeltaRecord implements ChangeGroupApi {

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
	type: string;

	@OneToMany({cascade: CascadeType.ALL, mappedBy: 'changeGroup'})
	entityChanges: EntityChange[] = [];

	@OneToMany({cascade: CascadeType.ALL, mappedBy: 'changeGroup'})
	entityWhereChanges: EntityWhereChange[] = [];

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
	): EntityChangeApi {
		if (entity instanceof ChangeGroup || entity instanceof AbstractEntityChange || entity instanceof AbstractFieldChange) {
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
	): EntityChangeApi {
		if (entity instanceof ChangeGroup || entity instanceof AbstractEntityChange || entity instanceof AbstractFieldChange) {
			return new StubEntityChange();
		}

		let entityChange = this.addNewEntityChange(entityName);
		entityChange.changeType = EntityChangeType.DELETE;
		entityChange.changedEntityId = entity[idProperty];

		return entityChange;
	}

	addNewDeleteWhereEntityChange<IE extends IEntity>(
		entityName: string,
		numberOfAffectedRecords: number,
		phJsonSqlDelete: PHJsonSQLDelete<IE>
	): EntityWhereChangeApi {
		let entityWhereChange = this.addNewEntityWhereChange(entityName, numberOfAffectedRecords);
		entityWhereChange.changeType = EntityChangeType.DELETE_WHERE;
		entityWhereChange.queryJson = JSON.stringify(phJsonSqlDelete);

		return entityWhereChange;
	}

	addNewUpdateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): EntityChangeApi {
		if (entity instanceof ChangeGroup || entity instanceof EntityChange || entity instanceof AbstractFieldChange) {
			return new StubEntityChange();
		}

		let entityChange = this.addNewEntityChange(entityName);
		entityChange.changeType = EntityChangeType.UPDATE;
		entityChange.changedEntityId = entity[idProperty];

		return entityChange;
	}

	addNewUpdateWhereEntityChange<IE extends IEntity>(
		entityName: string,
		numberOfAffectedRecords: number,
		phJsonSqlUpdate: PHJsonSQLUpdate<IE>
	): EntityWhereChangeApi {
		let entityWhereChange = this.addNewEntityWhereChange(entityName, numberOfAffectedRecords);
		entityWhereChange.changeType = EntityChangeType.UPDATE_WHERE;
		entityWhereChange.queryJson = JSON.stringify(phJsonSqlUpdate);

		return entityWhereChange;
	}

	private addNewEntityChange(
		entityName: string
	): EntityChange {
		let entityChange = new EntityChange();
		this.setupAbstractEntityChange(entityName, entityChange);
		this.entityChanges.push(entityChange);
		entityChange.numberOfFieldsInEntity = 0;

		return entityChange;
	}

	private addNewEntityWhereChange(
		entityName: string,
		numberOfAffectedRecords: number
	): EntityWhereChange {
		let entityWhereChange = new EntityWhereChange();
		this.setupAbstractEntityChange(entityName, entityWhereChange);
		entityWhereChange.numberOfAffectedRecords = numberOfAffectedRecords;
		this.entityWhereChanges.push(entityWhereChange);

		return entityWhereChange;
	}

	private setupAbstractEntityChange(
		entityName: string,
		abstractEntityChange: AbstractEntityChange
	): void {
		abstractEntityChange.entityChangeIdInGroup = ++this.numberOfEntitiesInGroup;

		abstractEntityChange.changeGroup = this;
		abstractEntityChange.createDateTime = this.createDateTime;
		abstractEntityChange.createDeviceId = this.createDeviceId;
		abstractEntityChange.createUserId = this.createUserId;
		abstractEntityChange.entityName = entityName;
		abstractEntityChange.id = AbstractEntityChange.getEntityChangeId(abstractEntityChange.entityChangeIdInGroup, this.createDeviceId,
			this.createDateTime, this.createUserId, this.groupIndexInMillisecond);

	}
}

export class StubChangeGroup implements ChangeGroupApi {

	id: string;
	createDateTime: Date;
	createDeviceId: string;
	createUserId: string;

	entityChanges: EntityChange[];
	groupIndexInMillisecond: number;
	numberOfEntitiesInGroup: number;
	syncStatus: SyncStatus;
	type: string;

	addNewCreateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string,
		idGenerator: IdGenerator
	): EntityChangeApi {
		return new StubEntityChange();
	}

	addNewDeleteEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): EntityChangeApi {
		return new StubEntityChange();
	}

	addNewDeleteWhereEntityChange<IE extends IEntity>(
		entityName: string,
		numberOfAffectedRecords: number,
		phJsonSqlDelete: PHJsonSQLDelete<IE>
	): EntityWhereChangeApi {
		return new StubWhereEntityChange();
	}

	addNewUpdateEntityChange(
		entityName: string,
		entity: any,
		idProperty: string
	): EntityChangeApi {
		return new StubEntityChange();
	}

	addNewUpdateWhereEntityChange<IE extends IEntity>(
		entityName: string,
		numberOfAffectedRecords: number,
		phJsonSqlUpdate: PHJsonSQLUpdate<IE>
	): EntityWhereChangeApi {
		return new StubWhereEntityChange();
	}

}