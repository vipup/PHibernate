import {NameMetadataUtils} from "../metadata/PHMetadataUtils";
/**
 * Created by Papa on 9/8/2016.
 */

export class UpdateCache {

	static updateCache:{[entityName:string]:{[id:string]:any}};

	static initCache():void {
		this.updateCache = {};
	}

	static dropCache():void {
		this.updateCache = {};
	}

	static saveToUpdateCache(
		entityName:string,
		entity:any
	):void {
		let entityCache = this.updateCache[entityName];
		if (!entityCache) {
			entityCache = {};
		}
		let rawId = NameMetadataUtils.getIdValue(entityName, entity);
		let idString = this.getIdString(rawId);
		entityCache[idString] = entity;
	}

	static getUpdateCache(
		entityName:string,
		id:any
	):any {
		let entityCache = this.updateCache[entityName];
		if (!entityCache) {
			return null;
		}
		let idString = this.getIdString(id);

		let entityRecord = entityCache[id];

		return entityRecord;
	}

	static getEntityUpdateCache(
		entityName:string,
		entity:any
	):any {
		let rawId = NameMetadataUtils.getIdValue(entityName, entity);
		return this.getUpdateCache(entityName, rawId);
	}

	static getIdString(id:any) {
		switch (typeof id) {
			case "number":
				return JSON.stringify(id);
			case "string":
				return id;
			default:
				throw `Unsupported typeof id, must be string or number`;
		}
	}

	static getEntityUpdateDiff(
		entityName:string,
		entity:any
	):any {
		let updateDiff = {};
		let originalRecord = this.getEntityUpdateCache(entityName, entity);

		if (!originalRecord) {
			return entity;
		}

		for (let originalProperty in originalRecord) {
			let originalValue = originalRecord[originalProperty];
			let newValue = entity[originalProperty];
			if (!this.valuesEqualIgnoreObjects(originalValue, newValue)) {
				updateDiff[originalProperty] = newValue;
			}
		}

		for (let updatedProperty in entity) {
			if (updateDiff[updatedProperty]) {
				continue;
			}
			updateDiff[updatedProperty] = entity[updatedProperty];
		}
``
		return updateDiff;
	}

	static valuesEqualIgnoreObjects(
		original:any,
		updated:any
	):boolean {
		if (typeof original === 'object') {
			if (original instanceof Date) {
				if (updated instanceof Date) {
					return original.getTime() === updated.getTime();
				} else {
					return false;
				}
			} else {
				// Skip child objects
				return true;
			}
		}
		if (!original) {
			if (original === '') {
				return updated === '';
			} else if (original === false) {
				return updated === false;
			}
			// treat undefined and null as same value
			return (!updated);
		}
		if (!updated) {
			return false;
		}
		if (typeof original !== typeof updated) {
			return false;
		}

		return original === updated;
	}

}