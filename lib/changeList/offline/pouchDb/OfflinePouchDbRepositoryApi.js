/**
 * Created by Papa on 5/28/2016.
 */
"use strict";
class OfflinePouchDbChangeRecordIterator {
    constructor(changeRecords, nextIndex = 0) {
        this.changeRecords = changeRecords;
        this.nextIndex = nextIndex;
        this.length = changeRecords.length;
    }
    next() {
        if (!this.hasNext()) {
            throw 'No more change records found';
        }
        let nextValue = this.changeRecords[this.nextIndex];
        this.nextIndex++;
        return nextValue;
    }
    hasNext() {
        return this.nextIndex < this.length;
    }
}
exports.OfflinePouchDbChangeRecordIterator = OfflinePouchDbChangeRecordIterator;
//# sourceMappingURL=OfflinePouchDbRepositoryApi.js.map