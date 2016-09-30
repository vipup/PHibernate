import {IOfflineDeltaStore} from "../../OfflineDeltaStore";
import {ILocalStoreAdaptor} from "../../../localStore/LocalStoreAdaptor";
import {StubChangeGroup, ChangeGroupApi} from "../../model/ChangeGroup";
import {IOfflineDeltaStoreConfig} from "../../../config/OfflineDeltaStoreConfig";
import {IEntityChange, EntityChange} from "../../model/EntityChange";
import {QChangeGroup} from "../../query/changegroup";
import {and, or} from "querydsl-typescript";
import {QEntityChange} from "../../query/entitychange";
/**
 * Created by Papa on 9/24/2016.
 */

export class OfflineSqlDeltaStore implements IOfflineDeltaStore {

	constructor(
		private localStore: ILocalStoreAdaptor,
		public config: IOfflineDeltaStoreConfig
	) {
	}

	async addRemoteChanges(
		changeGroups: ChangeGroupApi[]
	): Promise<ChangeGroupApi[]> {
		let entityIdMap: {[entityId: string]: boolean} = {};
		let earliestDate = changeGroups.map((changeGroup) => {
			changeGroup.entityChanges.sort(this.sortEntityChanges);
			changeGroup.entityChanges.forEach((entityChange) => {
				entityChange.changedEntityId;
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
		// Find all local records for these entities since the time of the first incoming change
		let cg, ec;
		let localChangeGroups = await QChangeGroup.find({
			select: {
				id: null
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
		changeGroups.sort(this.sortChangeGroups);
		localChangeGroups.sort(this.sortChangeGroups);

		if (localChangeGroups.length) {
			this.filterOutOverwrittenChanges(changeGroups, localChangeGroups)
		}

		return changeGroups;
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

				if(this.sortChangeGroups(changeGroup, localChangeGroup) > 0) {
					break;
				}
			}
		});
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
