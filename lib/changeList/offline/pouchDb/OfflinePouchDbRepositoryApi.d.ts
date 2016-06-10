/**
 * Created by Papa on 5/28/2016.
 */
import { ChangeRecordIterator, ChangeRecord, SharedChangeList } from "delta-store";
import { OfflinePouchDbChangeListShareInfo } from "./OfflinePouchDbSharingModel";
export interface OfflinePouchDbSharedChangeList extends SharedChangeList {
    shareInfo: OfflinePouchDbChangeListShareInfo;
}
export declare class OfflinePouchDbChangeRecordIterator implements ChangeRecordIterator {
    private changeRecords;
    private nextIndex;
    length: number;
    constructor(changeRecords: ChangeRecord[], nextIndex?: number);
    next(): ChangeRecord;
    hasNext(): boolean;
}
