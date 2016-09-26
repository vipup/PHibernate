/**
 * Created by Papa on 5/23/2016.
 */
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const DeltaStore_1 = require("../../changeList/DeltaStore");
const LocalStore_1 = require("../../localStore/LocalStore");
const OfflineDeltaStore_1 = require("../../changeList/OfflineDeltaStore");
const querydsl_typescript_1 = require("querydsl-typescript");
const PH_1 = require("../../config/PH");
const decorators_1 = require("../metadata/decorators");
class EntityManager {
    constructor(config) {
        this.config = config;
        if (!config.localStoreConfig) {
            throw `Local store is not configured`;
        }
        this.localStore = LocalStore_1.getLocalStoreAdaptor(config.localStoreConfig.setupInfo.type, this, config.localStoreConfig.setupInfo.idGeneration);
        let deltaStoreConfig = config.deltaStoreConfig;
        if (!deltaStoreConfig) {
            throw `Delta store is not configured`;
        }
        let sharingAdaptor = DeltaStore_1.getSharingAdaptor(deltaStoreConfig.setupInfo.platformType);
        this.deltaStore = new DeltaStore_1.DeltaStore(deltaStoreConfig, sharingAdaptor);
        if (deltaStoreConfig.offlineDeltaStore) {
            this.offlineDeltaStore = OfflineDeltaStore_1.getOfflineDeltaStore(this.localStore, deltaStoreConfig.offlineDeltaStore);
        }
    }
    getLocalStore(localStoreTypeName) {
        if (localStoreTypeName) {
            if (!this.localStore) {
                throw `LocalStore '${localStoreTypeName}' is not setup.`;
            }
        }
        return this.localStore;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            let initializers = [];
            let localStoreConfig = this.config.localStoreConfig;
            initializers.push(this.localStore.initialize(localStoreConfig.setupInfo));
            return Promise.all(initializers);
        });
    }
    goOffline() {
        this.deltaStore.goOffline();
        this.online = false;
    }
    goOnline() {
        return __awaiter(this, void 0, void 0, function* () {
            let initializers = [];
            initializers.push(this.deltaStore.goOnline());
            return Promise.all(initializers).then(results => this.online = true);
        });
    }
    isOnline() {
        return true;
    }
    create(entityClass, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entityClass, entity, 'create');
        });
    }
    delete(entityClass, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entityClass, entity, 'delete');
        });
    }
    save(entityClass, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entityClass, entity, 'persist');
        });
    }
    update(entityClass, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entityClass, entity, 'update');
        });
    }
    persistEntity(entityClass, entity, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            let changeGroup;
            yield this.localStore[operation](entityClass, entity, this.localStore.activeChangeGroup);
            return entity;
        });
    }
    saveActiveChangeGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            let changeGroup = this.localStore.activeChangeGroup;
            yield this.offlineDeltaStore.addChange(changeGroup);
            if (this.isOnline()) {
                yield this.deltaStore.addChange(this.deltaStore.config.changeListConfig, changeGroup);
            }
        });
    }
    ensureId(entity) {
    }
    search(entityClass, phRawQuery, subject) {
        let qEntity = PH_1.PH.getQEntityFromEntityClass(entityClass);
        let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
        return this.localStore.search(qEntity.__entityName__, phQuery, subject);
    }
    searchOne(entityClass, phRawQuery, subject) {
        let qEntity = PH_1.PH.getQEntityFromEntityClass(entityClass);
        let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
        return this.localStore.searchOne(qEntity.__entityName__, phQuery, subject);
    }
    find(entityClass, phRawQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let qEntity = PH_1.PH.getQEntityFromEntityClass(entityClass);
            let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
            return yield this.localStore.find(qEntity.__entityName__, phQuery);
        });
    }
    findOne(entityClass, phRawQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let qEntity = PH_1.PH.getQEntityFromEntityClass(entityClass);
            let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
            return yield this.localStore.findOne(qEntity.__entityName__, phQuery);
        });
    }
    getPHSQLQuery(qEntity, phRawQuery) {
        let qEntityMap = PH_1.PH.qEntityMap;
        let entitiesRelationPropertyMap = PH_1.PH.entitiesRelationPropertyMap;
        let entitiesPropertyTypeMap = PH_1.PH.entitiesPropertyTypeMap;
        let phSqlQuery = new querydsl_typescript_1.PHSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
        return phSqlQuery;
    }
}
__decorate([
    decorators_1.Transactional(), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Object]), 
    __metadata('design:returntype', Promise)
], EntityManager.prototype, "persistEntity", null);
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map