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

export interface IEntityManager {

	save<E>(
		entity?:E
	):Promise<E>;

	delete<E>(
		entity:E
	):Promise<void>;
}

export class EntityManager {

	deltaStoreMap:{[deltaStoreName:string]:IDeltaStore} = {};
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

	async goOnline():Promise<any> {
		let initializers:Promise<any>[] = [];

		for (let deltaStoreName in this.deltaStoreMap) {
			let deltaStore = this.deltaStoreMap[deltaStoreName];
			initializers.push(deltaStore.goOnline());
		}

		return Promise.all(initializers);
	}

	isExistingSetupInfo():boolean {
		return false;
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
		if (entityConfig.changeListConfig) {
			if (this.isOnline()) {
				let deltaStore = this.deltaStoreMap[entityConfig.changeListConfig.deltaStoreName];
				await deltaStore.addChange(entityConfig, entityProxy);
			} else {
				await this.offlineDeltaStore.addChange(entityConfig, entityProxy);
			}
		}
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			await localStore[operation](entity);
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