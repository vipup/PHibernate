"use strict";
var QueryState = (function () {
    function QueryState() {
        this.hasAll = false;
        this.hasFind = false;
        this.hasRetrieve = false;
        this.byOthers = [];
        this.includes = [];
    }
    QueryState.prototype.setSelectAll = function () {
        var errorPrefix = 'Cannot specify "selectAll()": ';
        this.validateByOrAllSetup(errorPrefix);
        this.hasAll = true;
    };
    QueryState.prototype.setWhere = function (//
        entity //
        ) {
        var errorPrefix = 'Cannot specify "where(q)": ';
        this.validateByOrAllSetup(errorPrefix);
        this.theBy = entity;
    };
    QueryState.prototype.setSelect = function () {
        var errorPrefix = 'Cannot specify "select()": ';
        if (this.hasFind) {
            throw errorPrefix + "find() is already specified";
        }
        this.hasFind = true;
    };
    QueryState.prototype.addWhereOther = function (//
        otherQ //
        ) {
        var errorPrefix = 'Cannot specify "otherBy(qO)": ';
        this.validateByOrAllPresent(errorPrefix);
        this.byOthers.push(otherQ);
    };
    QueryState.prototype.addInclude = function (otherQ //
        ) {
        var errorPrefix = 'Cannot specify "include(qO)": ';
        this.validateByOrAllPresent(errorPrefix);
        this.includes.push(otherQ);
    };
    QueryState.prototype.setRetrieve = function (//
        repository //
        ) {
        var errorPrefix = 'Cannot specify "execute()": ';
        if (this.hasRetrieve) {
            throw errorPrefix + " \"retrieve()\" IS already specified";
        }
        this.validateByOrAllPresent(errorPrefix);
        this.hasRetrieve = true;
        return null;
    };
    ;
    QueryState.prototype.equals = function (//
        otherState, //
        checkValues //
        ) {
        if (checkValues === void 0) { checkValues = true; }
        if (this.hasAll) {
            if (!otherState.hasAll) {
                return false;
            }
        }
        else if (otherState.hasAll) {
            return false;
        }
        if (this.hasFind) {
            if (!otherState.hasFind) {
                return false;
            }
        }
        else if (otherState.hasFind) {
            return false;
        }
        if (this.hasRetrieve) {
            if (!otherState.hasRetrieve) {
                return false;
            }
        }
        else if (otherState.hasRetrieve) {
            return false;
        }
        if (this.theBy) {
            if (!otherState.theBy) {
                return false;
            }
        }
        else if (otherState.theBy) {
            return false;
        }
        if (!this.theBy.objectEquals(otherState.theBy, checkValues)) {
            return false;
        }
        if (this.byOthers.length != otherState.byOthers.length) {
            return false;
        }
        for (var i = 0; i < this.byOthers.length; i++) {
            var myByOther = this.byOthers[i];
            var otherByOther = otherState.byOthers[i];
            if (!myByOther.objectEquals(otherByOther, checkValues)) {
                return false;
            }
        }
        if (this.includes.length != otherState.includes.length) {
            return false;
        }
        for (var i = 0; i < this.includes.length; i++) {
            var myInclude = this.includes[i];
            var otherInclude = otherState.includes[i];
            if (!myInclude.objectEquals(otherInclude, checkValues)) {
                return false;
            }
        }
        return true;
    };
    QueryState.prototype.validateByOrAllSetup = function (//
        errorPrefix //
        ) {
        if (!this.hasFind) {
            throw errorPrefix + "find() is NOT specified";
        }
        if (this.theBy) {
            throw errorPrefix + "by(q) IS already specified";
        }
        if (this.hasAll) {
            throw errorPrefix + "all() IS already specified";
        }
        if (this.byOthers) {
            throw errorPrefix + "byOther(otherQ) IS already specified";
        }
    };
    QueryState.prototype.validateByOrAllPresent = function (//
        errorPrefix //
        ) {
        if (!this.theBy) {
            throw errorPrefix + "by(q) is NOT specified";
        }
        if (!this.hasAll) {
            throw errorPrefix + "all() is NOT specified";
        }
    };
    return QueryState;
}());
exports.QueryState = QueryState;
//# sourceMappingURL=QueryState.js.map