/**
 * Created by Papa on 9/2/2016.
 */
import {UserUtils} from "../shared/UserUtils";
import {EntityChange} from "../changeList/model/EntityChange";
import {ChangeGroup} from "../changeList/model/ChangeGroup";
import {DeltaRecord} from "../changeList/model/DeltaRecord";
export enum IdGeneration {
	ENTITY_CHANGE_ID
}

export interface IdGenerator {
	generateChangeGroupId(
		changeGroup: ChangeGroup
	): string;

	generateEntityId(
		entity: any,
		entityChange: EntityChange
	): string;

	getIdType(): 'string' | 'number';
}

export class UserTimeStampIdGenerator implements IdGenerator {

	lastChangeGroupIndexForTimeStamp: number;
	lastChangeGroupTimestamp: number;

	generateChangeGroupId(changeGroup: ChangeGroup): string {
		let cgIndexInMillisecond = this.getChangeGroupIndexInMillisecond();
		changeGroup.groupIndexInMillisecond = cgIndexInMillisecond;
		return DeltaRecord.getDRId(changeGroup, cgIndexInMillisecond);
	}

	generateEntityId(
		entity: any,
		entityChange: EntityChange
	): string {
		// TODO: implement non change-based id generation
		return entityChange.id;
	}

	getChangeGroupIndexInMillisecond(): number {
		let nowTimeStamp = new Date().getTime();

		if (this.lastChangeGroupTimestamp != nowTimeStamp) {
			this.lastChangeGroupTimestamp = nowTimeStamp;
			this.lastChangeGroupIndexForTimeStamp = 1;
		} else {
			this.lastChangeGroupIndexForTimeStamp++;
		}

		return this.lastChangeGroupIndexForTimeStamp;
	}

	getIdType(): 'string' | 'number' {
		return 'string';
	}

}

export function getIdGenerator(
	idGeneration: IdGeneration
) {
	switch (idGeneration) {
		case IdGeneration.ENTITY_CHANGE_ID:
			return new UserTimeStampIdGenerator();
		default:
			throw `Unsupported IdGeneration: ${idGeneration}`;
	}
}