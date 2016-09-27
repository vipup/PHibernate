import {IOfflineDeltaStore} from "../../OfflineDeltaStore";
import {ILocalStoreAdaptor} from "../../../localStore/LocalStoreAdaptor";
import {StubChangeGroup, IChangeGroup} from "../../model/ChangeGroup";
import {IOfflineDeltaStoreConfig} from "../../../config/OfflineDeltaStoreConfig";
import {IEntityChange} from "../../model/EntityChange";
import {QChangeGroup} from "../../query/changegroup";
/**
 * Created by Papa on 9/24/2016.
 */

export class OfflineSqlDeltaStore implements IOfflineDeltaStore {

	constructor(
		private localStore: ILocalStoreAdaptor,
		public config:IOfflineDeltaStoreConfig
	) {
	}

	async addRemoteChanges(
		changeRecords:IChangeGroup[]
	):Promise<IChangeGroup[]> {
			let cg;
			QChangeGroup.find({
				select: {
					id: null
				},
				from: [
					cg = QChangeGroup.q
				]
			})
			return null;
	}

	async addChange(
		changeRecord:IChangeGroup
	):Promise<IChangeGroup> {
		await this.localStore.create('ChangeGroup', changeRecord, new StubChangeGroup());

		return null;
	}

	async findChangesForEntitiesWithFieldsSinceTime(
		entityChanges:IEntityChange[]
	):Promise<IEntityChange[]> {
			return null;
	}

	async findUnsyncedChanges():Promise<IChangeGroup[]> {
		return null;
	}

	async markChangesAsSynced(changeGroups:IChangeGroup[]):Promise<void> {
		return null;
	}
}
