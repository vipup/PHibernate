/**
 * Created by Papa on 9/2/2016.
 */
import {UserUtils} from "../shared/UserUtils";
export enum IdGeneration {
	USER_TIMESTAMP
}

export interface IdGenerator {
	generateId(
		entityClass: {new (): any}
	): string | number;

	getIdType(): 'string' | 'number';
}

export class UserTimeStampIdGenerator implements IdGenerator {

	lastIdForTimeStamp: number;
	lastTimestamp: number;

	generateId(
		entityClass: {new (): any}
	): string | number {

		let nowTimeStamp = new Date().getTime();
		let userId = UserUtils.getUserId();

		if (this.lastTimestamp != nowTimeStamp) {
			this.lastTimestamp = nowTimeStamp;
			this.lastIdForTimeStamp = 1;
		} else {
			this.lastIdForTimeStamp++;
		}

		return `${userId}_${nowTimeStamp}_${this.lastIdForTimeStamp}`;
	}

	getIdType(): 'string' | 'number' {
		return 'string';
	}

}

export function getIdGenerator(
	idGeneration:IdGeneration
) {
	switch (idGeneration) {
		case IdGeneration.USER_TIMESTAMP:
			return new UserTimeStampIdGenerator();
		default:
			throw `Unsupported IdGeneration: ${idGeneration}`;
	}
}