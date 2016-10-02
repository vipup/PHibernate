"use strict";
class QueryState {
    constructor() {
        this.hasSelectAll = false;
        this.hasSelect = false;
        this.hasExecute = false;
        this.whereOthers = [];
        this.includes = [];
    }
    setSelectAll() {
        let errorPrefix = 'Cannot specify "selectAll()": ';
        this.validateByOrAllSetup(errorPrefix);
        this.hasSelectAll = true;
    }
    setWhere(//
        entity //
    ) {
        let errorPrefix = 'Cannot specify "where(q)": ';
        this.validateByOrAllSetup(errorPrefix);
        this.theWhere = entity;
    }
    setSelect() {
        let errorPrefix = 'Cannot specify "select()": ';
        if (this.hasSelect) {
            throw errorPrefix + `find() is already specified`;
        }
        this.hasSelect = true;
    }
    addWhereOther(//
        otherQ //
    ) {
        let errorPrefix = 'Cannot specify "otherBy(qO)": ';
        this.validateByOrAllPresent(errorPrefix);
        this.whereOthers.push(otherQ);
    }
    addInclude(otherQ //
    ) {
        let errorPrefix = 'Cannot specify "include(qO)": ';
        this.validateByOrAllPresent(errorPrefix);
        this.includes.push(otherQ);
    }
    setExecute(//
        repository //
    ) {
        let errorPrefix = 'Cannot specify "execute()": ';
        if (this.hasExecute) {
            throw errorPrefix + ` "retrieve()" IS already specified`;
        }
        this.validateByOrAllPresent(errorPrefix);
        this.hasExecute = true;
        return null;
    }
    ;
    equals(//
        otherState, //
        checkValues = true //
    ) {
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
        /*
                if (!this.theWhere.objectEquals(otherState.theWhere, checkValues)) {
                    return false;
                }
        
                if (this.whereOthers.length != otherState.whereOthers.length) {
                    return false;
                }
                for (let i = 0; i < this.whereOthers.length; i++) {
                    let myByOther = this.whereOthers[i];
                    let otherByOther = otherState.whereOthers[i];
                    if (!myByOther.objectEquals(otherByOther, checkValues)) {
                        return false;
                    }
                }
        
                if (this.includes.length != otherState.includes.length) {
                    return false;
                }
                for (let i = 0; i < this.includes.length; i++) {
                    let myInclude = this.includes[i];
                    let otherInclude = otherState.includes[i];
                    if (!myInclude.objectEquals(otherInclude, checkValues)) {
                        return false;
                    }
                }
        */
        return true;
    }
    validateByOrAllSetup(//
        errorPrefix //
    ) {
        if (!this.hasSelect) {
            throw errorPrefix + `find() is NOT specified`;
        }
        if (this.theWhere) {
            throw errorPrefix + `by(q) IS already specified`;
        }
        if (this.hasSelectAll) {
            throw errorPrefix + `all() IS already specified`;
        }
        if (this.whereOthers) {
            throw errorPrefix + `byOther(otherQ) IS already specified`;
        }
    }
    validateByOrAllPresent(//
        errorPrefix //
    ) {
        if (!this.theWhere) {
            throw errorPrefix + `by(q) is NOT specified`;
        }
        if (!this.hasSelectAll) {
            throw errorPrefix + `all() is NOT specified`;
        }
    }
}
exports.QueryState = QueryState;
//# sourceMappingURL=QueryState.js.map