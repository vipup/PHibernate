/// <reference path="../../../typings/main.d.ts" />

import {EntityCandidate} from "./EntityCandidate";
import {PropertyDocEntry} from "./DocEntry";
import {endsWith}  from "./utils";
/**
 * Created by Papa on 3/27/2016.
 */

export class EntityCandidateRegistry {

	entityCandidateMap:Map<string, EntityCandidate> = new Map<string, EntityCandidate>();

	constructor(
		private rootEntity:EntityCandidate
	) {
	}

	addCandidate(
		candidate:EntityCandidate
	):void {
		let matchesExisting = this.matchToExistingEntity(candidate);
		if (!matchesExisting) {
			this.entityCandidateMap.set(candidate.type, candidate);
		} else {
			candidate = this.entityCandidateMap.get(candidate.type);
		}
		if (candidate.parentKeyword === this.rootEntity.type) {
			candidate.parent = this.rootEntity;
		} else {
			let parentEntity = this.entityCandidateMap.get(candidate.parentKeyword);
			if (parentEntity) {
				candidate.parent = parentEntity;
			}
		}
	}

	matchVerifiedEntities( //
		targetCandidateRegistry?:EntityCandidateRegistry //
	):EntityCandidate[] {

		let verifiedEntities = this.verify();

		let verifiedEntitySet = new Set();

		for (let candidate of this.entityCandidateMap.values()) {
			verifiedEntitySet.add(candidate);
		}

		let matchingEntities:EntityCandidate[] = [];

		for (let targetCandidate of targetCandidateRegistry.entityCandidateMap.values()) {
			if (verifiedEntitySet.has(targetCandidate)) {
				matchingEntities.push(targetCandidate);
			}
		}

		return matchingEntities;
	}

	verify():EntityCandidate[] {
		let verifiedEntities:EntityCandidate[] = [];

		for (let [type, candidate] of this.entityCandidateMap) {
			let parent = candidate;
			while (parent.parent) {
				parent = parent.parent;
			}
			if (parent === this.rootEntity) {
				verifiedEntities.push(candidate);
			} else {
				/*
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
				 */
			}
		}

		verifiedEntities.forEach(( //
			verifiedEntity:EntityCandidate //
		) => {
			let properties = verifiedEntity.docEntry.properties;
			if (!properties) {
				return;
			}
			properties.forEach(( //
				property:PropertyDocEntry //
			) => {
				let type = property.type;
				if (endsWith(type, '[]')) {
					property.isArray = true;
					type = type.substr(0, type.length - 2);
				}
				switch (type) {
					case 'boolean':
						property.primitive = 'boolean';
						return;
					case 'number':
						property.primitive = 'number';
						return;
					case 'string':
						property.primitive = 'string';
						return;
				}
				let foundEntity = verifiedEntities.some(( //
					verifiedEntity:EntityCandidate //
				) => {
					if (verifiedEntity.type === type) {
						property.entity = verifiedEntity;
						return true;
					}
				});
				if (!foundEntity) {
					throw `Unknown Entity type: '${type}'`;
				}
			});
		});

		return verifiedEntities;
	}


	matchToExistingEntity(
		entityCandidate:EntityCandidate
	) {
		let existingCandidate = this.entityCandidateMap.get(entityCandidate.type);
		if (!existingCandidate) {
			return false;
		}
		return true;
	}

}