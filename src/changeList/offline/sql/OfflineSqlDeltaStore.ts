import {IOfflineDeltaStore} from "../../OfflineDeltaStore";
import {ILocalStoreAdaptor} from "../../../localStore/LocalStoreAdaptor";
import {StubChangeGroup, ChangeGroupApi} from "../../model/ChangeGroup";
import {IOfflineDeltaStoreConfig} from "../../../config/OfflineDeltaStoreConfig";
import {IEntityChange} from "../../model/EntityChange";
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
		changeRecords: ChangeGroupApi[]
	): Promise<ChangeGroupApi[]> {
		let entityIdMap: {[entityId: string]: boolean} = {};
		let earliestDate = changeRecords.map((changeRecord) => {
			changeRecord.entityChanges.forEach((entityChange) => {
				entityChange.changedEntityId;
				entityIdMap[entityChange.changedEntityId] = true;
			});
			return changeRecord.createDateTime;
		}).reduce((previousDate, currentDate) => {
			if (previousDate.getTime() > currentDate.getTime()) {
				return currentDate;
			}
			return previousDate;
		});
		let entityIds:string[] = [];
		for(let entityId in entityIdMap) {
			entityIds.push(entityId);
		}
		let cg:, ec;
		let localChangeRecords = await QChangeGroup.find({
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
		return null;
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
