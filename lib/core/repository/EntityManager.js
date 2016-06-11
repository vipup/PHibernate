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
    goOnline() {
        return __awaiter(this, void 0, void 0, function* () {
            let initializers = [];
            for (let deltaStoreName in this.deltaStoreMap) {
                let deltaStore = this.deltaStoreMap[deltaStoreName];
                initializers.push(deltaStore.goOnline());
            }
            return Promise.all(initializers);
        });
    }
    isExistingSetupInfo() {
        return false;
    }
    isOnline() {
        return true;
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entity, 'create');
        });
    }
    delete(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entity, 'delete');
        });
    }
    persist(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entity, 'persist');
        });
    }
    update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.persistEntity(entity, 'update');
        });
    }
    persistEntity(entity, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityConfig = this.config.getEntityConfig(entity);
            let entityProxy = entity;
            if (entityConfig.changeListConfig) {
                if (this.isOnline()) {
                    let deltaStore = this.deltaStoreMap[entityConfig.changeListConfig.deltaStoreName];
                    yield deltaStore.addChange(entityConfig, entityProxy);
                }
                else {
                    yield this.offlineDeltaStore.addChange(entityConfig, entityProxy);
                }
            }
            if (entityConfig.localStoreConfig) {
                let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
                yield localStore[operation](entity);
            }
            return entity;
        });
    }
    query(qEntity) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityConfig = this.config.getEntityConfigFromQ(qEntity);
            if (entityConfig.localStoreConfig) {
                let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
                if (localStore) {
                    return yield localStore.query(qEntity);
                }
            }
            throw `Entity is not setup with a LocalStore`;
        });
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map