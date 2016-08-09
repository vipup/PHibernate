/**
 * Created by Papa on 5/23/2016.
 */
"use strict";
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
const OfflineStore_1 = require("../../changeList/OfflineStore");
const querydsl_typescript_1 = require("querydsl-typescript");
const PH_1 = require("../../config/PH");
const EntityUtils_1 = require("../../shared/EntityUtils");
class EntityManager {
    constructor(config) {
        this.config = config;
        this.deltaStoreMap = {};
        this.localStoreMap = {};
        if (config.offlineDeltaStore) {
            let offlineSharingAdaptor = OfflineStore_1.getOfflineSharingAdaptor(config.offlineDeltaStore.type);
            this.offlineDeltaStore = new DeltaStore_1.DeltaStore(config.offlineDeltaStore, offlineSharingAdaptor);
        }
        if (config.hasDeltaStores) {
            for (let deltaStoreName in config.deltaStoreConfigMap) {
                let deltaStoreConfig = config.deltaStoreConfigMap[deltaStoreName];
                let sharingAdaptor = DeltaStore_1.getSharingAdaptor(deltaStoreConfig.setupInfo.platformType);
                let deltaStore = new DeltaStore_1.DeltaStore(deltaStoreConfig, sharingAdaptor);
                this.deltaStoreMap[deltaStoreName] = deltaStore;
            }
        }
        if (config.hasLocalStores) {
            for (let localStoreName in config.localStoreConfigMap) {
                let localStoreConfig = config.localStoreConfigMap[localStoreName];
                let localStoreAdaptor = LocalStore_1.getLocalStoreAdaptor(localStoreConfig.setupInfo.type);
                this.localStoreMap[localStoreName] = localStoreAdaptor;
            }
        }
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            let initializers = [];
            if (this.offlineDeltaStore) {
                initializers.push(this.offlineDeltaStore.goOnline());
            }
            for (let localStoreName in this.localStoreMap) {
                let localStoreConfig = this.config.localStoreConfigMap[localStoreName];
                let localStore = this.localStoreMap[localStoreName];
                initializers.push(localStore.initialize(localStoreConfig.setupInfo));
            }
            return Promise.all(initializers);
        });
    }
    goOffline() {
        for (let deltaStoreName in this.deltaStoreMap) {
            let deltaStore = this.deltaStoreMap[deltaStoreName];
            deltaStore.goOffline();
        }
        this.online = false;
    }
    goOnline() {
        return __awaiter(this, void 0, void 0, function* () {
            let initializers = [];
            for (let deltaStoreName in this.deltaStoreMap) {
                let deltaStore = this.deltaStoreMap[deltaStoreName];
                initializers.push(deltaStore.goOnline());
            }
            return Promise.all(initializers).then(results => this.online = true);
        });
    }
    isOnline() {
        return true;
    }
    create(entity, cascadeRule) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entity, 'create', cascadeRule);
        });
    }
    delete(entity, cascadeRule) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entity, 'delete', cascadeRule);
        });
    }
    save(entity, cascadeRule) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entity, 'persist', cascadeRule);
        });
    }
    update(entity, cascadeRule) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entity, 'update', cascadeRule);
        });
    }
    persistEntity(entity, operation, cascadeRule) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityConfig = this.config.getEntityConfig(entity);
            let entityProxy = entity;
            this.setForeignKeys(entity, cascadeRule);
            let persistedInLocalStore = false;
            if (entityConfig.localStoreConfig) {
                let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
                yield localStore[operation](entity);
                persistedInLocalStore = true;
            }
            let persistedInDeltaStore = false;
            if (entityConfig.changeListConfig) {
                if (this.isOnline()) {
                    let deltaStore = this.deltaStoreMap[entityConfig.changeListConfig.deltaStoreName];
                    yield deltaStore.addChange(entityConfig, entityProxy);
                }
                else {
                    yield this.offlineDeltaStore.addChange(entityConfig, entityProxy);
                }
                persistedInDeltaStore = true;
            }
            if (!persistedInDeltaStore && !persistedInLocalStore) {
                throw `Entity is not persisted in either Delta Store or Local Store`;
            }
            return entity;
        });
    }
    ensureId(entity) {
    }
    setForeignKeys(entity, cascadeRule) {
        let entityConfig = this.config.getEntityConfig(entity);
        let entityClassName = EntityUtils_1.EntityUtils.getClassName(entity.constructor);
        let entityRelationPropertyMap = PH_1.PH.entitiesRelationPropertyMap[entityClassName];
        for (let propertyName in entityRelationPropertyMap) {
            let relationRecord = entityRelationPropertyMap[propertyName];
            if (entity[propertyName]) {
                switch (relationRecord.relationType) {
                    case querydsl_typescript_1.RelationType.MANY_TO_ONE:
                        // FIXME: work here next
                        break;
                    default:
                }
            }
        }
    }
    search(entityClass, iEntity, subject) {
        let qEntity = PH_1.PH.getQEntityFromEntityClass(entityClass);
        let entityConfig = this.config.getEntityConfigFromQ(qEntity);
        let phQuery = this.getPHQuery(qEntity, iEntity);
        if (entityConfig.localStoreConfig) {
            let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
            if (localStore) {
                return localStore.search(entityClass, phQuery, subject);
            }
        }
        throw `Entity is not setup with a LocalStore`;
    }
    searchOne(entityClass, iEntity, subject) {
        let qEntity = PH_1.PH.getQEntityFromEntityClass(entityClass);
        let entityConfig = this.config.getEntityConfigFromQ(qEntity);
        let phQuery = this.getPHQuery(qEntity, iEntity);
        if (entityConfig.localStoreConfig) {
            let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
            if (localStore) {
                return localStore.searchOne(entityClass, phQuery, subject);
            }
        }
        throw `Entity is not setup with a LocalStore`;
    }
    find(entityClass, iEntity) {
        return __awaiter(this, void 0, void 0, function* () {
            let qEntity = PH_1.PH.getQEntityFromEntityClass(entityClass);
            let entityConfig = this.config.getEntityConfigFromQ(qEntity);
            let phQuery = this.getPHQuery(qEntity, iEntity);
            if (entityConfig.localStoreConfig) {
                let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
                if (localStore) {
                    return yield localStore.find(entityClass, phQuery);
                }
            }
            throw `Entity is not setup with a LocalStore`;
        });
    }
    findOne(entityClass, iEntity) {
        return __awaiter(this, void 0, void 0, function* () {
            let qEntity = PH_1.PH.getQEntityFromEntityClass(entityClass);
            let entityConfig = this.config.getEntityConfigFromQ(qEntity);
            let phQuery = this.getPHQuery(qEntity, iEntity);
            if (entityConfig.localStoreConfig) {
                let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
                if (localStore) {
                    return yield localStore.findOne(entityClass, phQuery);
                }
            }
            throw `Entity is not setup with a LocalStore`;
        });
    }
    getPHQuery(qEntity, iEntity) {
        let qEntityMap = PH_1.PH.qEntityMap;
        let entitiesRelationPropertyMap = PH_1.PH.entitiesRelationPropertyMap;
        let entitiesPropertyTypeMap = PH_1.PH.entitiesPropertyTypeMap;
        let phQuery = new querydsl_typescript_1.PHQuery(iEntity, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
        return phQuery;
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map