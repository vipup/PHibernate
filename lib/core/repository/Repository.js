"use strict";
const QueryState_1 = require("../query/QueryState");
class QRepository {
    selectAll() {
        this.currentQueryState = new QueryState_1.QueryState();
        this.currentQueryState.setSelectAll();
        return this;
    }
    where(//
        ...operations //
    ) {
        let q = this.getQ();
        // q.and.apply(q, operations);
        this.currentQueryState.setWhere(q);
        return this;
    }
    select() {
        this.currentQueryState = new QueryState_1.QueryState();
        this.currentQueryState.setSelect();
        return this;
    }
    whereOther(//
        otherQ //
    ) {
        this.currentQueryState.addWhereOther(otherQ);
        return this;
    }
    include(//
        otherQ //
    ) {
        this.currentQueryState.addInclude(otherQ);
        return this;
    }
    getQuery() {
        return this.currentQueryState;
    }
    setQuery(//
        query //
    ) {
        this.currentQueryState = query;
    }
    execute(//
        repository //
    ) {
        // this.currentQueryState.setRetrieve(repository);
        return null;
    }
    ;
}
exports.QRepository = QRepository;
//# sourceMappingURL=Repository.js.map