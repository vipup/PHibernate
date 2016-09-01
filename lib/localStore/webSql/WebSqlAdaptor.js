"use strict";
const PH_1 = require("../../config/PH");
/**
 * Created by Papa on 8/30/2016.
 */
class WebSqlAdaptor {
    initialize(setupInfo) {
        for (let entityName in PH_1.PH.qEntityMap) {
        }
        return null;
    }
    create(entity) {
        let sql = `INSERT INTO A VALUES (?, ?), ['a', 2]`;
        return null;
    }
    delete(entity) {
        let sql = `DELETE FROM A where b = ?`;
        return null;
    }
    find(entityClass, phQuery) {
        return null;
    }
    findOne(entityClass, phQuery) {
        return null;
    }
    save(entity) {
        return null;
    }
    search(entityClass, phQuery, subject) {
        return null;
    }
    searchOne(entityClass, phQuery, subject) {
        return null;
    }
    update(entity) {
        let sql = `UPDATE A SET b = ?  WHERE c = ?`;
        return null;
    }
}
exports.WebSqlAdaptor = WebSqlAdaptor;
//# sourceMappingURL=WebSqlAdaptor.js.map