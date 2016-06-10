/**
 * Created by Papa on 5/23/2016.
 */

import {getSharingAdaptor, IDeltaStore, DeltaStore} from "../../changeList/DeltaStore";
import {IPersistenceConfig} from "../../config/PersistenceConfig";
import {IEntityConfig} from "../../config/EntityConfig";
import {SharingAdaptor, PlatformType, SharedChangeList, ChangeListShareInfo} from "delta-store";
import {getLocalStoreAdaptor} from "../../localStore/LocalStore";
import {LocalStoreAdaptor} from "../../localStore/LocalStoreAdaptor";
import {getOfflineSharingAdaptor} from "../../changeList/OfflineStore";
import {IChangeListConfig} from "../../config/ChangeListConfig";
import {IDeltaStoreConfig} from "../../config/DeltaStoreConfig";

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

	if

	async initialize():Promise<any> {
		let initializers:Promise<any>[] = [];
		let config = this.config;

		for (let deltaStoreName in this.deltaStoreMap) {
			let deltaStore = this.deltaStoreMap[deltaStoreName];
			initializers.push(deltaStore.goOnline());
		}

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

	isExistingSetupInfo():boolean {
		return false;
	}

	async save<E>(
		entity?:E
	):Promise<E> {
		if (entity) {
			return this.saveEntity(entity);
		}
		return null;
	}

	async delete<E>(
		entity:E
	):Promise<void> {
		return null;
	}

	private async saveEntity<E>(
		entity:E
	):Promise<E> {
		let entityConfig = this.config.getEntityConfig(entity);
		if (entityConfig.changeListConfig) {
			let sharingAdaptor = getSharingAdaptor(PlatformType.GOOGLE);
		}
		return null;
	}

	private async saveEntityInChangeList(
		entityConfig:IEntityConfig
	):Promise<boolean> {
		let changeListConfig = entityConfig.changeListConfig;
		if (!changeListConfig) {
			return false;
		}
		return true;
	}

}