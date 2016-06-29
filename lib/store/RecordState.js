"use strict";
class RecordStateData {
    constructor() {
        this.accessed = {};
        this.current = {};
        this.initialized = {};
        this.original = {};
    }
}
exports.RecordStateData = RecordStateData;
class RecordState {
    constructor() {
        this.data = new RecordStateData();
        this.initialized = false;
        this.isDirty = false;
        this.proxied = false;
    }
    getChangeRecord() {
        return null;
    }
}
exports.RecordState = RecordState;
//# sourceMappingURL=RecordState.js.map