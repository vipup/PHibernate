/**
 * Created by Papa on 5/23/2016.
 */

import {getSharingAdaptor, IDeltaStore, DeltaStore} from "../../changeList/DeltaStore";
import {IPersistenceConfig} from "../../config/PersistenceConfig";
import {IEntityConfig} from "../../config/EntityConfig";
import {PlatformType} from "delta-store";
import {getLocalStoreAdaptor} from "../../localStore/LocalStore";
import {LocalStoreAdaptor} from "../../localStore/LocalStoreAdaptor";
import {getOfflineSharingAdaptor} from "../../changeList/OfflineStore";
import {EntityProxy} from "../proxy/Proxies";
import {IQEntity} from "querydsl-typescript/lib/index";
import {StoreAdaptor} from "../../store/StoreAdaptor";

export interface IEntityManager extends StoreAdaptor {

	goOffline():void;
	goOnline():Promise<any>;
	initialize():Promise<any>;
	isOnline():boolean;
}

export class EntityManager implements IEntityManager {

	deltaStoreMap:{[deltaStoreName:string]:IDeltaStore} = {};
	online:boolean;
	offlineDeltaStore:IDeltaStore;
	localStoreMap:{[localStoreTypeName:string]:LocalStoreAdaptor} = {};

	constructor(
		public config:IPersistenceConfig
	) {
		if (config.offlineDeltaStore) {
			let offlineSharingAdaptor = getOfflineSharingAdaptor(config.offlineDeltaStore.type);
			this.offlineDeltaStore = new DeltaStore(config.offlineDeltaStore, offlineSharingAdaptor);
		}
		if (config.hasDeltaStores) {
			for (let deltaStoreName in config.deltaStoreConfigMap) {
				let deltaStoreConfig = config.deltaStoreConfigMap[deltaStoreName];
				let sharingAdaptor = getSharingAdaptor(deltaStoreConfig.setupInfo.platformType);
				let deltaStore = new DeltaStore(deltaStoreConfig, sharingAdaptor);
				this.deltaStoreMap[deltaStoreName] = deltaStore;
			}
		}
		if (config.hasLocalStores) {
			for (let localStoreName in config.localStoreConfigMap) {
				let localStoreConfig = config.localStoreConfigMap[localStoreName];
				let localStoreAdaptor = getLocalStoreAdaptor(localStoreConfig.setupInfo.type);
				this.localStoreMap[localStoreName] = localStoreAdaptor;
			}
		}
	}

	async initialize():Promise<any> {
		let initializers:Promise<any>[] = [];

		if (this.offlineDeltaStore) {
			initializers.push(this.offlineDeltaStore.goOnline());
		}

		for (let localStoreName in this.localStoreMap) {
			let localStoreConfig = this.config.localStoreConfigMap[localStoreName];
			let localStore = this.localStoreMap[localStoreName];
			initializers.push(localStore.initialize(localStoreConfig.setupInfo));
		}

		return Promise.all(initializers);
	}

	goOffline():void {
		for (let deltaStoreName in this.deltaStoreMap) {
			let deltaStore = this.deltaStoreMap[deltaStoreName];
			deltaStore.goOffline();
		}
		this.online = false;
	}

	async goOnline():Promise<any> {
		let initializers:Promise<any>[] = [];

		for (let deltaStoreName in this.deltaStoreMap) {
			let deltaStore = this.deltaStoreMap[deltaStoreName];
			initializers.push(deltaStore.goOnline());
		}

		return Promise.all(initializers).then(results => this.online = true);
	}

	isOnline():boolean {
		return true;
	}

	async create<E>(
		entity:E
	):Promise<E> {
		return this.persistEntity(entity, 'create');
	}

	async delete<E>(
		entity:E
	):Promise<E> {
		return this.persistEntity(entity, 'delete');
	}

	async persist<E>(
		entity:E
	):Promise<E> {
		return this.persistEntity(entity, 'persist');
	}

	async update<E>(
		entity:E
	):Promise<E> {
		return this.persistEntity(entity, 'update');
	}

	private async persistEntity<E>(
		entity:E,
		operation:'create' | 'delete' | 'persist' | 'update'
	):Promise<E> {
		let entityConfig = this.config.getEntityConfig(entity);
		let entityProxy:EntityProxy = <EntityProxy><any>entity;
		let persistedInDeltaStore:boolean = false;
		if (entityConfig.changeListConfig) {
			if (this.isOnline()) {
				let deltaStore = this.deltaStoreMap[entityConfig.changeListConfig.deltaStoreName];
				await deltaStore.addChange(entityConfig, entityProxy);
			} else {
				await this.offlineDeltaStore.addChange(entityConfig, entityProxy);
			}
			persistedInDeltaStore = true;
		}
		let persistedInLocalStore:boolean = false;
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			await localStore[operation](entity);
			persistedInLocalStore = true;
		}
		if (!persistedInDeltaStore && !persistedInLocalStore) {
			throw `Entity is not persisted in either Delta Store or Local Store`;
		}
		return entity;
	}

	async query<E, IQE extends IQEntity<IQE>>(
		qEntity:IQE
	):Promise<E> {
		let entityConfig = this.config.getEntityConfigFromQ(qEntity);
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (localStore) {
				return await <E><any>localStore.query(qEntity);
			}
		}
		throw `Entity is not setup with a LocalStore`;
	}

}