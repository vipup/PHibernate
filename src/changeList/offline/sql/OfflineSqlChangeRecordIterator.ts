import {ChangeRecordIterator, ChangeRecord} from "delta-store";
/**
 * Created by Papa on 5/28/2016.
 */

export class OfflineSqlChangeRecordIterator implements ChangeRecordIterator {

	next(): ChangeRecord {
		return null;
	}

	hasNext(): boolean {
		return false;
	}

}