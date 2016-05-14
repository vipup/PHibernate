"use strict";
var QueryState = (function () {
    function QueryState() {
        this.hasSelectAll = false;
        this.hasSelect = false;
        this.hasExecute = false;
        this.whereOthers = [];
        this.includes = [];
    }
    QueryState.prototype.setSelectAll = function () {
        var errorPrefix = 'Cannot specify "selectAll()": ';
        this.validateByOrAllSetup(errorPrefix);
        this.hasSelectAll = true;
    };
    QueryState.prototype.setWhere = function (//
        entity //
        ) {
        var errorPrefix = 'Cannot specify "where(q)": ';
        this.validateByOrAllSetup(errorPrefix);
        this.theWhere = entity;
    };
    QueryState.prototype.setSelect = function () {
        var errorPrefix = 'Cannot specify "select()": ';
        if (this.hasSelect) {
            throw errorPrefix + "find() is already specified";
        }
        this.hasSelect = true;
    };
    QueryState.prototype.addWhereOther = function (//
        otherQ //
        ) {
        var errorPrefix = 'Cannot specify "otherBy(qO)": ';
        this.validateByOrAllPresent(errorPrefix);
        this.whereOthers.push(otherQ);
    };
    QueryState.prototype.addInclude = function (otherQ //
        ) {
        var errorPrefix = 'Cannot specify "include(qO)": ';
        this.validateByOrAllPresent(errorPrefix);
        this.includes.push(otherQ);
    };
    QueryState.prototype.setExecute = function (//
        repository //
        ) {
        var errorPrefix = 'Cannot specify "execute()": ';
        if (this.hasExecute) {
            throw errorPrefix + " \"retrieve()\" IS already specified";
        }
        this.validateByOrAllPresent(errorPrefix);
        this.hasExecute = true;
        return null;
    };
    ;
    QueryState.prototype.equals = function (//
        otherState, //
        checkValues //
        ) {
        if (checkValues === void 0) { checkValues = true; }
        if (this.hasSelectAll) {
            if (!otherState.hasSelectAll) {
                return false;
            }
        }
        else if (otherState.hasSelectAll) {
            return false;
        }
        if (this.hasSelect) {
            if (!otherState.hasSelect) {
                return false;
            }
        }
        else if (otherState.hasSelect) {
            return false;
        }
        if (this.hasExecute) {
            if (!otherState.hasExecute) {
                return false;
            }
        }
        else if (otherState.hasExecute) {
            return false;
        }
        if (this.theWhere) {
            if (!otherState.theWhere) {
                return false;
            }
        }
        else if (otherState.theWhere) {
            return false;
        }
        if (!this.theWhere.objectEquals(otherState.theWhere, checkValues)) {
            return false;
        }
        if (this.whereOthers.length != otherState.whereOthers.length) {
            return false;
        }
        for (var i = 0; i < this.whereOthers.length; i++) {
            var myByOther = this.whereOthers[i];
            var otherByOther = otherState.whereOthers[i];
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
        if (!this.hasSelect) {
            throw errorPrefix + "find() is NOT specified";
        }
        if (this.theWhere) {
            throw errorPrefix + "by(q) IS already specified";
        }
        if (this.hasSelectAll) {
            throw errorPrefix + "all() IS already specified";
        }
        if (this.whereOthers) {
            throw errorPrefix + "byOther(otherQ) IS already specified";
        }
    };
    QueryState.prototype.validateByOrAllPresent = function (//
        errorPrefix //
        ) {
        if (!this.theWhere) {
            throw errorPrefix + "by(q) is NOT specified";
        }
        if (!this.hasSelectAll) {
            throw errorPrefix + "all() is NOT specified";
        }
    };
    return QueryState;
}());
exports.QueryState = QueryState;
//# sourceMappingURL=QueryState.js.map