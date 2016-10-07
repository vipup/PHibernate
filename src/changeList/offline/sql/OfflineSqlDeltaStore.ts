import {IOfflineDeltaStore} from "../../OfflineDeltaStore";
import {ILocalStoreAdaptor} from "../../../localStore/LocalStoreAdaptor";
import {StubChangeGroup, ChangeGroupApi} from "../../model/ChangeGroup";
import {IOfflineDeltaStoreConfig} from "../../../config/OfflineDeltaStoreConfig";
import {EntityChangeApi, EntityChange} from "../../model/EntityChange";
import {QChangeGroup} from "../../query/changegroup";
import {
	and, or, QEntity, RelationRecord, PHJsonSQLUpdate, IEntity, PHSQLUpdate,
	PHSQLDelete, PHJsonSQLDelete, FieldMap
} from "querydsl-typescript";
import {QEntityChange} from "../../query/entitychange";
import {Transactional} from "../../../core/metadata/decorators";
import {EntityChangeType, AbstractEntityChange} from "../../model/AbstractEntityChange";
import {PHUpdate} from "querydsl-typescript/lib/query/PHQuery";
import {EntityWhereChange, EntityWhereChangeApi} from "../../model/EntityWhereChange";
import {SyncFieldMap, SyncEntityFieldMap} from "./SyncFieldMap";
import {NameMetadataUtils} from "../../../core/metadata/PHMetadataUtils";
import {AbstractFieldChange, AbstractFieldChangeApi} from "../../model/AbstractFieldChange";
/**
 * Created by Papa on 9/24/2016.
 */

export enum ChangeGroupOrigin {
	LOCAL,
	REMOTE
}

export interface ChangeGroupWithOrigin {
	changeGroup: ChangeGroupApi;
	origin: ChangeGroupOrigin;
}

export interface OrderedEntityChange {
	order: number;
	entityChange: EntityChange;
}

class PHRemoteSQLUpdate<IE extends IEntity> extends PHSQLUpdate<IE> {

	constructor(
		public phJsonSqlQuery: PHJsonSQLUpdate<IE>,
		qEntity: QEntity<any>,
		qEntityMap: {[entityName: string]: QEntity<any>},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	) {
		super(null, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
	}

	toSQL(): PHJsonSQLUpdate<IE> {
		return this.phJsonSqlQuery;
	}
}

class PHRemoteSQLDelete<IE extends IEntity> extends PHSQLDelete<IE> {

	constructor(
		public phJsonSqlQuery: PHJsonSQLDelete<IE>,
		qEntity: QEntity<any>,
		qEntityMap: {[entityName: string]: QEntity<any>},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	) {
		super(null, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
	}

	toSQL(): PHJsonSQLDelete<IE> {
		return this.phJsonSqlQuery;
	}
}

export class OfflineSqlDeltaStore implements IOfflineDeltaStore {

	constructor(
		private localStore: ILocalStoreAdaptor,
		public config: IOfflineDeltaStoreConfig
	) {
	}

	/**
	 * Remote updates (do not code any optimizations until there is a test suite in place)
	 In a single Transaction:
	 1)  Find all local change records for matching Entity Names since the time of first remote record
	 2)  Filter out any remote changes that are already in the local store
	 3)  Save remaining remote Change Groups
	 4)  Add all local and remote changes into a single list and order
	 5)  Prune all deleted entities from the point of their deletion forward
	 6)  Re-execute all pruned ChangeGroups in order
	 7)  Notify all matching attached queries of changes

	 * @param changeGroups
	 * @returns {ChangeGroupApi[]}
	 */
	@Transactional()
	async addRemoteChanges(
		changeGroups: ChangeGroupApi[]
	): Promise<void> {
		let entityNameMap: {[entityName: string]: boolean} = {};
		let remoteChangeGroupMap: {[id: string]: ChangeGroupApi} = {};
		// 0) a) merge all entity changes into a single list and sort,
		// b) get the names of all entities in remote changes
		// c) get the earliest time of all remote changes coming in
		let earliestDate = changeGroups.map((changeGroup) => {
			remoteChangeGroupMap[changeGroup.id] = changeGroup;
			if (!changeGroup.entityChanges) {
				changeGroup.entityChanges = [];
			}
			if (!changeGroup.entityWhereChanges) {
				changeGroup.entityWhereChanges = [];
			}
			changeGroup.abstractEntityChanges = (<AbstractEntityChange[]>changeGroup.entityChanges).concat(changeGroup.entityWhereChanges);
			changeGroup.abstractEntityChanges.sort(this.sortEntityChanges);
			changeGroup.abstractEntityChanges.forEach((entityChange) => {
				entityNameMap[entityChange.entityName] = true;
			});
			return changeGroup.createDateTime;
		}).reduce((previousDate, currentDate) => {
			if (previousDate.getTime() > currentDate.getTime()) {
				return currentDate;
			}
			return previousDate;
		});
		let entityNames: string[] = [];
		for (let entityName in entityNameMap) {
			entityNames.push(entityName);
		}
		// 1)  Find all local change records for matching Entity Names since the time of first remote record
		// a) find matching entityChanges
		let localEChangeGroups;
		{
			let cg, ec;
			localEChangeGroups = await QChangeGroup.find({
				select: {
					'*': null,
					entityChanges: {
						'*': null,
						booleanFieldChanges: {},
						dateFieldChanges: {},
						numberFieldChanges: {},
						stringFieldChanges: {}
					},
					entityWhereChanges: {}
				},
				from: [
					cg = QChangeGroup.from,
					ec = cg.entityChanges.innerJoin(),
					ec.booleanFieldChanges.leftJoin(),
					ec.dateFieldChanges.leftJoin(),
					ec.numberFieldChanges.leftJoin(),
					ec.stringFieldChanges.leftJoin(),
					cg.entityWhereChanges.leftJoin()
				],
				where: and(
					cg.createDateTime.greaterThanOrEquals(earliestDate),
					ec.entityName.isIn(entityNames)
				)
			});
		}
		// b) find matching entityWhereChanges
		let localEWChangeGroups;
		{
			let cg, ec, ewc;
			localEWChangeGroups = await QChangeGroup.find({
				select: {
					'*': null,
					entityChanges: {
						'*': null,
						booleanFieldChanges: {},
						dateFieldChanges: {},
						numberFieldChanges: {},
						stringFieldChanges: {}
					},
					entityWhereChanges: {}
				},
				from: [
					cg = QChangeGroup.from,
					ec = cg.entityChanges.leftJoin(),
					ec.booleanFieldChanges.leftJoin(),
					ec.dateFieldChanges.leftJoin(),
					ec.numberFieldChanges.leftJoin(),
					ec.stringFieldChanges.leftJoin(),
					ewc = cg.entityWhereChanges.innerJoin()
				],
				where: and(
					cg.createDateTime.greaterThanOrEquals(earliestDate),
					ewc.entityName.isIn(entityNames)
				)
			});
		}
		// c) merge entity and entityWhere Change Groups
		let localChangeGroups = localEChangeGroups.concat(localEWChangeGroups);

		// 2)  Filter out any remote changes that are already in the local store
		let localChangeGroupsWithOrigin: ChangeGroupWithOrigin[] = localChangeGroups.map((changeGroup) => {
			delete remoteChangeGroupMap[changeGroup.id];
			if (!changeGroup.entityChanges) {
				changeGroup.entityChanges = [];
			}
			for (let i = changeGroup.entityChanges.length - 1; i >= 0; i--) {
				// a) remove all local creates (do not attempt to re-create already existing entities)
				if (changeGroup.entityChanges[0] === EntityChangeType.CREATE) {
					changeGroup.entityChanges.splice(i, 1);
				}
			}
			if (!changeGroup.entityWhereChanges) {
				changeGroup.entityWhereChanges = [];
			}
			changeGroup.abstractEntityChanges = (<AbstractEntityChange[]>changeGroup.entityChanges).concat(changeGroup.entityWhereChanges);
			changeGroup.abstractEntityChanges.sort(this.sortEntityChanges);
			return {
				origin: ChangeGroupOrigin.LOCAL,
				changeGroup: changeGroup
			}
		});
		// 3)  Save remaining remote Change Groups
		let remoteChangeGroupsWithOrigin: ChangeGroupWithOrigin[] = [];
		for (let id in remoteChangeGroupMap) {
			let remoteChangeGroup = remoteChangeGroupMap[id];
			this.addChange(remoteChangeGroup);
			remoteChangeGroupsWithOrigin.push({
				origin: ChangeGroupOrigin.REMOTE,
				changeGroup: remoteChangeGroup
			});
		}

		// 4)  Add all local and remote changes into a single list and order
		let changeGroupsWithOrigin = remoteChangeGroupsWithOrigin.concat(localChangeGroupsWithOrigin);
		changeGroupsWithOrigin.sort(this.sortChangeGroupsWithOrigin);

		// a) Ignore all local changes before the first remote change group
		let lastPriorLocalChangeIndex = -1;
		changeGroupsWithOrigin.some((changeGroupWithOrigin) => {
			switch (changeGroupWithOrigin.origin) {
				case ChangeGroupOrigin.LOCAL:
					// Ignore any local changes before any remote changes
					lastPriorLocalChangeIndex++;
					return false;
				case ChangeGroupOrigin.REMOTE:
					return true;
			}
		});
		changeGroupsWithOrigin = changeGroupsWithOrigin.slice(lastPriorLocalChangeIndex + 1, changeGroupsWithOrigin.length);

		// 5)  Prune all deleted entities from the point of their deletion forward
		let deletedEntityMap: {[type: string]: {[id: string]: EntityChange}} = {};
		changeGroupsWithOrigin.forEach((changeGroupWithOrigin) => {
			let entityChanges = changeGroupWithOrigin.changeGroup.entityChanges;
			for (let i = entityChanges.length - 1; i >= 0; i--) {
				let entityChange = entityChanges[i];
				let deletedEntitiesOfType = deletedEntityMap[entityChange.entityName];
				if (!deletedEntitiesOfType) {
					deletedEntitiesOfType = {};
					deletedEntityMap[entityChange.entityName] = deletedEntitiesOfType;
				}
				if (deletedEntitiesOfType[entityChange.changedEntityId]) {
					entityChanges.splice(i, 1);
					continue;
				}
				if (entityChange.changeType === EntityChangeType.DELETE) {
					deletedEntitiesOfType[entityChange.changedEntityId] = entityChange;
				}
			}
		});
		// 6)  Re-execute all pruned ChangeGroups in order
		// a)
		let fieldMap = new SyncFieldMap();
		changeGroupsWithOrigin.forEach((changeGroupWithOrigin) => {
			let stubChangeGroup = new StubChangeGroup();
			let entityChanges = changeGroupWithOrigin.changeGroup.abstractEntityChanges;
			entityChanges.forEach((entityChange) => {
				switch (entityChange.changeType) {
					case EntityChangeType.CREATE:
						await this.executeCreate(<EntityChangeApi>entityChange, fieldMap, stubChangeGroup);
						return;
					case EntityChangeType.DELETE:
						await this.executeDelete(<EntityChangeApi>entityChange, fieldMap, stubChangeGroup);
						return;
					case EntityChangeType.DELETE_WHERE:
						await this.executeDeleteWhere(<EntityWhereChangeApi>entityChange, fieldMap, stubChangeGroup);
						return;
					case EntityChangeType.UPDATE:
						await this.executeUpdate(<EntityChangeApi>entityChange, fieldMap, stubChangeGroup);
						return;
					case EntityChangeType.UPDATE_WHERE:
						await this.executeUpdateWhere(<EntityWhereChangeApi>entityChange, fieldMap, stubChangeGroup);
						return;
				}
			});

		});

		// 7)  Notify all matching attached queries of changes

	}

	private async executeCreate(entityChange: EntityChangeApi, fieldMap: SyncFieldMap, changeGroup: ChangeGroupApi): Promise<void> {
		let entityName = entityChange.entityName;
		let entity = {};
		let entityFieldMap = fieldMap.ensureEntity(entityName);
		this.addFieldChanges(entityChange.booleanFieldChanges, entityFieldMap, entity);
		this.addFieldChanges(entityChange.dateFieldChanges, entityFieldMap, entity);
		this.addFieldChanges(entityChange.numberFieldChanges, entityFieldMap, entity);
		this.addFieldChanges(entityChange.stringFieldChanges, entityFieldMap, entity);
		await this.localStore.insert(entityName, entity, changeGroup);
	}

	private addFieldChanges<FC extends AbstractFieldChangeApi<any>>(fieldChanges: FC[], entityFieldMap: SyncEntityFieldMap, entity: any) {
		fieldChanges.forEach((fieldChange) => {
			if (fieldChange.entityRelationName) {
				entityFieldMap.ensureRelation(fieldChange.propertyName);
			} else {
				entityFieldMap.ensureField(fieldChange.propertyName);
			}
			entity[fieldChange.propertyName] = fieldChange.newValue;
		});
	}

	private async executeDelete(entityChange: EntityChangeApi, fieldMap: SyncFieldMap, changeGroup: ChangeGroupApi): Promise<void> {

	}

	private async executeDeleteWhere(entityWhereChange: EntityWhereChangeApi, fieldMap: SyncFieldMap, changeGroup: ChangeGroupApi): Promise<void> {

	}

	private async executeUpdate(entityChange: EntityChangeApi, fieldMap: SyncFieldMap, changeGroup: ChangeGroupApi): Promise<void> {

	}

	private async executeUpdateWhere(entityWhereChange: EntityWhereChangeApi, fieldMap: SyncFieldMap): Promise<void> {

	}


	/**
	 * Remove any modifications that were later updated by another change
	 * @param changeGroups  remotely created change groups
	 * @param localChangeGroups locally created change groups
	 */
	private filterOutOverwrittenChanges(
		changeGroups: ChangeGroupApi[],
		localChangeGroups: ChangeGroupApi[]
	) {

		let currLocalCGIndex = 0;
		changeGroups.forEach((changeGroup) => {
			while (currLocalCGIndex < localChangeGroups.length) {
				let localChangeGroup = localChangeGroups[currLocalCGIndex];

				if (this.sortChangeGroups(changeGroup, localChangeGroup) > 0) {
					break;
				}
			}
		});
	}

	private sortChangeGroupsWithOrigin(cgo1: ChangeGroupWithOrigin, cgo2: ChangeGroupWithOrigin) {
		return this.sortChangeGroups(cgo1.changeGroup, cgo2.changeGroup);
	}

	private sortChangeGroups(cg1: ChangeGroupApi, cg2: ChangeGroupApi): number {
		let time1 = cg1.createDateTime.getTime();
		let time2 = cg2.createDateTime.getTime();
		if (time1 > time2) {
			return 1;
		}
		if (time2 > time1) {
			return -1;
		}
		let deviceId1 = cg1.createDeviceId;
		let deviceId2 = cg2.createDeviceId;
		if (deviceId1 > deviceId2) {
			return 1;
		}
		if (deviceId2 > deviceId1) {
			return -1;
		}
		let userId1 = cg1.createUserId;
		let userId2 = cg2.createUserId;
		if (userId1 > userId2) {
			return 1;
		}
		if (userId2 > userId1) {
			return -1;
		}
		let inMilliIdx1 = cg1.groupIndexInMillisecond;
		let inMilliIdx2 = cg2.groupIndexInMillisecond;
		if (inMilliIdx1 > inMilliIdx2) {
			return 1;
		}
		if (inMilliIdx2 > inMilliIdx1) {
			return -1;
		}
		return 0;
	}

	private sortEntityChanges(ec1: AbstractEntityChange, ec2: AbstractEntityChange): number {
		let id1 = ec1.entityChangeIdInGroup;
		let id2 = ec2.entityChangeIdInGroup;
		if (id1 > id2) {
			return 1;
		}
		if (id2 > id1) {
			return -1;
		}
		return 0;
	}

	async addChange(
		changeRecord: ChangeGroupApi
	): Promise<ChangeGroupApi> {
		await this.localStore.create('ChangeGroup', changeRecord, new StubChangeGroup());

		return null;
	}

	async findChangesForEntitiesWithFieldsSinceTime(
		entityChanges: EntityChangeApi[]
	): Promise<EntityChangeApi[]> {
		return null;
	}

	async findUnsyncedChanges(): Promise<ChangeGroupApi[]> {
		return null;
	}

	async markChangesAsSynced(changeGroups: ChangeGroupApi[]): Promise<void> {
		return null;
	}
}
