"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const decorators_1 = require("../core/metadata/decorators");
const index_1 = require("querydsl-typescript/lib/index");
const Observable_1 = require("rxjs/Observable");
/**
 * Created by Papa on 6/11/2016.
 */
function like(like) {
    let instance = index_1.QueryOperation.getDefinedInstance(index_1.OperationType.LIKE, like);
    return instance;
}
exports.like = like;
function greaterThan(greaterThan) {
    let instance = index_1.QueryOperation.getDefinedInstance(index_1.OperationType.GREATER_THAN, greaterThan);
    return instance;
}
exports.greaterThan = greaterThan;
class DateUtils {
    static getNowTimeStamp() {
        return new Date().toJSON();
    }
    iQuery(test) {
        let em = null;
        let params = null;
        /*
                em.query<ITask>(Task, {
        
                });
                em.queryOnce<ITask>(Task, {})
                */
    }
}
__decorate([
    decorators_1.Query(decorators_1.Task, (q, strVal, numVal) => ({
        description: q.strOp.like(strVal),
        taskId: q.numOp.greaterThan(numVal)
    }), this.iQuery), 
    __metadata('design:type', Observable_1.Observable)
], DateUtils.prototype, "test", void 0);
exports.DateUtils = DateUtils;
//# sourceMappingURL=DateUtils.js.map