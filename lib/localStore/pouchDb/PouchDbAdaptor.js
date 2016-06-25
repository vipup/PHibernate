"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const index_1 = require("querydsl-typescript/lib/index");
const EntityUtils_1 = require("../../shared/EntityUtils");
const DateUtils_1 = require("../../shared/DateUtils");
const PouchDB = require('pouchdb');
/**
 * Created by Papa on 5/28/2016.
 */
class PouchDbAdaptor {
    initialize(setupInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let dbName = setupInfo.name;
            var localDB = PouchDB(dbName);
            return yield localDB.info().then((dbInfo) => {
                console.log(dbInfo);
            });
        });
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let className = EntityUtils_1.EntityUtils.getObjectClassName(entity);
            let nowTimeStamp = DateUtils_1.DateUtils.getNowTimeStamp();
            let record = entity;
            record._id = `${className}_${nowTimeStamp}`;
            let updateRecord = yield this.localDB.put(record);
            record._rev = updateRecord.rev;
            return record;
        });
    }
    delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = entity;
            let deleteRecord = yield this.localDB.remove(record);
            return entity;
        });
    }
    query(iQEntity, qEntity) {
        let qEntityMap = {};
        let entitiesRelationPropertyMap = {};
        let entitiesPropertyTypeMap = {};
        let phQuery = new index_1.PHQuery(iQEntity, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
        let jsonQuery = phQuery.toJSON();
        let pouchDbQuery = new index_1.PouchDbQuery(qEntity.__entityName__, entitiesRelationPropertyMap, entitiesPropertyTypeMap, jsonQuery);
        pouchDbQuery.parse();
        this.localDB.find({
            selector: pouchDbQuery.selector,
            fields: pouchDbQuery.fields
        });
        return null;
    }
    queryOnce(iQEntity, qEntity) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = entity;
            if (record._id && record._rev) {
                return yield this.update(entity);
            }
            else {
                return yield this.create(entity);
            }
        });
    }
    update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = entity;
            record.lastUpdateTime = new Date();
            let updateRecord = yield this.localDB.put(record);
            record._rev = updateRecord.rev;
            return record;
        });
    }
}
exports.PouchDbAdaptor = PouchDbAdaptor;
//# sourceMappingURL=PouchDbAdaptor.js.map