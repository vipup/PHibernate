import {EntityCandidate} from "./EntityCandidate";
/**
 * Created by Papa on 3/27/2016.
 */

export class EntityCandidateRegistry {

	entityCandidateMap:{[type:string]:EntityCandidate} = {};

	constructor(
		private rootEntity:EntityCandidate
	) {
	}

	addCandidate(
		candidate:EntityCandidate
	):void {
		let matchesExisting = this.matchToExistingEntity(candidate);
		if (!matchesExisting) {
			this.entityCandidateMap[candidate.type] = candidate;
		} else {
			candidate = this.entityCandidateMap[candidate.type];
		}
		if (candidate.parentKeyword === this.rootEntity.type) {
			candidate.parent = this.rootEntity;
		} else {
			let parentEntity = this.entityCandidateMap[candidate.parentKeyword];
			if (parentEntity) {
				candidate.parent = parentEntity;
			}
		}
	}

	verify():EntityCandidate[] {
		let verifiedEntities:EntityCandidate[] = [];

		for (let type in this.entityCandidateMap) {
			let candidate = this.entityCandidateMap[type];
			let parent = candidate;
			while (parent.parent) {
				parent = parent.parent;
			}
			if (parent === this.rootEntity) {
				verifiedEntities.push(candidate);
			} else {
				let errorMessage = `Could not verify entity ${candidate.type}`;
				if (parent !== candidate) {
					let inheritanceChain = '';
					parent = candidate.parent;
					while (parent) {
						inheritanceChain += ` -> ${parent.type}`;
						parent = parent.parent;
					}
					errorMessage += inheritanceChain;
				}
				errorMessage += '.';
				throw errorMessage;
			}
		}

		return verifiedEntities;
	}

	matchToExistingEntity(
		entityCandidate:EntityCandidate
	) {
		let existingCandidate = this.entityCandidateMap[entityCandidate.type];
		if (!existingCandidate) {
			return false;
		}
		return true;
	}

}