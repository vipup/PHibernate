/**
 * Created by Papa on 5/28/2016.
 */

import {ChangeRecordIterator, ChangeRecord, ChangeError, SharedChangeList} from "delta-store";
import {OfflinePouchDbChangeListShareInfo} from "./OfflinePouchDbSharingModel";
import {Subject} from "rxjs/Subject";

export interface OfflinePouchDbSharedChangeList extends SharedChangeList {

	shareInfo:OfflinePouchDbChangeListShareInfo;

}

export class OfflinePouchDbChangeRecordIterator implements ChangeRecordIterator {

	length:number;

	constructor(
		private changeRecords:ChangeRecord[],
		private nextIndex = 0
	) {
		this.length = changeRecords.length;
	}

	next():ChangeRecord {
		if (!this.hasNext()) {
			throw 'No more change records found';
		}
		let nextValue = this.changeRecords[this.nextIndex];
		this.nextIndex++;

		return nextValue;
	}

	hasNext():boolean {
		return this.nextIndex < this.length;
	}
}