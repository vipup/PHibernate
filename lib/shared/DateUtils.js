"use strict";
const index_1 = require("querydsl-typescript/lib/index");
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
exports.DateUtils = DateUtils;
//# sourceMappingURL=DateUtils.js.map