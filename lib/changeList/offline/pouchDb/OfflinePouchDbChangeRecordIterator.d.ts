import { ChangeRecordIterator, ChangeRecord } from "delta-store";
/**
 * Created by Papa on 5/28/2016.
 */
export declare class OfflinePouchDbChangeRecordIterator implements ChangeRecordIterator {
    next(): ChangeRecord;
    hasNext(): boolean;
}
