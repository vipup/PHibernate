"use strict";
/**
 * Created by Papa on 4/21/2016.
 */
require("es6-shim");
var QueryState_1 = require("../query/QueryState");
var QRepository = (function () {
    function QRepository() {
    }
    QRepository.prototype.selectAll = function () {
        this.currentQueryState = new QueryState_1.QueryState();
        this.currentQueryState.setSelectAll();
        return this;
    };
    QRepository.prototype.where = function () {
        var operations = []; //
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i - 0] = arguments[_i];
        }
        var q = this.getQ();
        q.and.apply(q, operations);
        this.currentQueryState.setWhere(q);
        return this;
    };
    QRepository.prototype.select = function () {
        this.currentQueryState = new QueryState_1.QueryState();
        this.currentQueryState.setSelect();
        return this;
    };
    QRepository.prototype.whereOther = function (//
        otherQ //
        ) {
        this.currentQueryState.addWhereOther(otherQ);
        return this;
    };
    QRepository.prototype.include = function (//
        otherQ //
        ) {
        this.currentQueryState.addInclude(otherQ);
        return this;
    };
    QRepository.prototype.getQuery = function () {
        return this.currentQueryState;
    };
    QRepository.prototype.setQuery = function (//
        query //
        ) {
        this.currentQueryState = query;
    };
    QRepository.prototype.execute = function (//
        repository //
        ) {
        // this.currentQueryState.setRetrieve(repository);
        return null;
    };
    ;
    return QRepository;
}());
exports.QRepository = QRepository;
//# sourceMappingURL=Repository.js.map