import {IOfflineDeltaStore} from "../../OfflineDeltaStore";
import {ILocalStoreAdaptor} from "../../../localStore/LocalStoreAdaptor";
import {StubChangeGroup, ChangeGroupApi} from "../../model/ChangeGroup";
import {IOfflineDeltaStoreConfig} from "../../../config/OfflineDeltaStoreConfig";
import {IEntityChange, EntityChange} from "../../model/EntityChange";
import {QChangeGroup} from "../../query/changegroup";
import {
	and, or, QEntity, RelationRecord, PHJsonSQLUpdate, IEntity, PHSQLUpdate,
	PHSQLDelete, PHJsonSQLDelete
} from "querydsl-typescript";
import {QEntityChange} from "../../query/entitychange";
import {Transactional} from "../../../core/metadata/decorators";
import {EntityChangeType} from "../../model/AbstractEntityChange";
import {PHUpdate} from "querydsl-typescript/lib/query/PHQuery";
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
	 1)  Find all local change records for each remotely changed entity since the first remote records
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
		let entityIdMap: {[entityId: string]: boolean} = {};
		let remoteChangeGroupMap: {[id: string]: ChangeGroupApi} = {};
		let earliestDate = changeGroups.map((changeGroup) => {
			remoteChangeGroupMap[changeGroup.id] = changeGroup;
			changeGroup.entityChanges.sort(this.sortEntityChanges);
			changeGroup.entityChanges.forEach((entityChange) => {
				entityIdMap[entityChange.changedEntityId] = true;
			});
			return changeGroup.createDateTime;
		}).reduce((previousDate, currentDate) => {
			if (previousDate.getTime() > currentDate.getTime()) {
				return currentDate;
			}
			return previousDate;
		});
		let entityIds: string[] = [];
		for (let entityId in entityIdMap) {
			entityIds.push(entityId);
		}
		// 1) Find all local records for these entities since the time of the first incoming change
		let cg, ec;
		let localChangeGroups = await QChangeGroup.find({
			select: {
				'*': null,
				entityChanges: {
					'*': null,
					booleanFieldChanges: {},
					dateFieldChanges: {},
					numberFieldChanges: {},
					stringFieldChanges: {}
				},
			},
			from: [
				cg = QChangeGroup.from,
				ec = cg.entityChanges.innerJoin()
			],
			where: and(
				cg.createDateTime.greaterThanOrEquals(earliestDate),
				ec.changedEntityId.isIn(entityIds)
			)
		});
		// 2)  Filter out any remote changes that are already in the local store
		let localChangeGroupsWithOrigin: ChangeGroupWithOrigin[] = localChangeGroups.map((changeGroup) => {
			delete remoteChangeGroupMap[changeGroup.id];
			changeGroup.entityChanges.sort(this.sortEntityChanges);
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

		// 4a)  Impl detail: Ignore all local changes before the first remote change group
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

		changeGroupsWithOrigin.forEach((changeGroupWithOrigin) => {
			changeGroupWithOrigin.changeGroup;

		});

		// 7)  Notify all matching attached queries of changes

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

	private sortEntityChanges(ec1: EntityChange, ec2: EntityChange): number {
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
		entityChanges: IEntityChange[]
	): Promise<IEntityChange[]> {
		return null;
	}

	async findUnsyncedChanges(): Promise<ChangeGroupApi[]> {
		return null;
	}

	async markChangesAsSynced(changeGroups: ChangeGroupApi[]): Promise<void> {
		return null;
	}
}
