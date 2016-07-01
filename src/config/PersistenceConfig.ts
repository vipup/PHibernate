/**
 * Created by Papa on 5/28/2016.
 */

import {EntityConfig, IEntityConfig, PHEntityConfig} from "./EntityConfig";
import {createLocalStoreConfig, ILocalStoreConfig, PHLocalStoreConfig} from "./LocalStoreConfig";
import {
	IChangeListConfig, ChangeListConfig, PHChangeListConfig, PHOfflineDeltaStoreConfig,
	IOfflineDeltaStoreConfig, OfflineDeltaStoreConfig
} from "./ChangeListConfig";
import {PHDeltaStoreConfig, IDeltaStoreConfig, createDeltaStoreConfig} from "./DeltaStoreConfig";
import {IQEntity} from "querydsl-typescript/lib/index";
import {DistributionStrategy, PlatformType} from "delta-store/lib/index";
import {LocalStoreType} from "../localStore/LocalStoreApi";
import {EntityUtils} from "../shared/EntityUtils";

export interface PHPersistenceConfig {
	appName:string;
	deltaStores?:{[name:string]:PHDeltaStoreConfig};
	default?:{
		changeList:PHChangeListConfig;
		entity:PHEntityConfig;
	};
	entities?:{[name:string]:PHEntityConfig};
	changeLists:{[refName:string]:PHChangeListConfig};
	localStores:{[refName:string]:PHLocalStoreConfig};
	offlineDeltaStore?:PHOfflineDeltaStoreConfig;
}

export interface IPersistenceConfig {

	changeListConfigMap:{[changeListName:string]:IChangeListConfig};
	deltaStoreConfigMap:{[deltaStoreName:string]:IDeltaStoreConfig};
	entityConfigMap:{[className:string]:IEntityConfig};
	localStoreConfigMap:{[storeName:string]:ILocalStoreConfig};
	hasChangeLists:boolean;
	hasDeltaStores:boolean;
	hasLocalStores:boolean;
	offlineDeltaStore:IOfflineDeltaStoreConfig;

	getEntityConfig(
		entity:any
	):IEntityConfig;

	getEntityConfigFromQ<IQE extends IQEntity>(
		qEntity:IQE
	):IEntityConfig;
}

export class PersistenceConfig implements IPersistenceConfig {

	static getDefaultPHConfig(
		appName:string = 'DefaultApp',
		distributionStrategy:DistributionStrategy = DistributionStrategy.S3_SECURE_POLL,
		deltaStorePlatform:PlatformType = PlatformType.GOOGLE,
		localStoreType:LocalStoreType = LocalStoreType.POUCH_DB,
		offlineDeltaStoreType:LocalStoreType = LocalStoreType.POUCH_DB
	):PHPersistenceConfig {
		return {
			appName: appName,
			changeLists: {
				"DefaultChangeList": {}
			},
			default: {
				changeList: {
					distributionStrategy: distributionStrategy,
					deltaStore: "DefaultDeltaStore"
				},
				entity: {
					changeList: "DefaultChangeList",
					localStore: "DefaultLocalStore"
				}
			},
			deltaStores: {
				"DefaultDeltaStore": {
					platform: deltaStorePlatform
				}
			},
			localStores: {
				"DefaultLocalStore": {
					type: localStoreType
				}
			},
			offlineDeltaStore: {
				type: offlineDeltaStoreType
			}
		};
	}

	changeListConfigMap:{[changeListName:string]:IChangeListConfig} = {};
	deltaStoreConfigMap:{[className:string]:IDeltaStoreConfig} = {};
	entityConfigMap:{[className:string]:IEntityConfig} = {};
	localStoreConfigMap:{[storeName:string]:ILocalStoreConfig} = {};
	hasChangeLists:boolean;
	hasDeltaStores:boolean;
	hasLocalStores:boolean;
	offlineDeltaStore:IOfflineDeltaStoreConfig;

	constructor(
		private config:PHPersistenceConfig
	) {
		this.hasDeltaStores = false;
		if (config.deltaStores) {
			for (let deltaStoreName in config.deltaStores) {
				let phDeltaStoreConfig = config.deltaStores[deltaStoreName];
				let deltaStoreConfig = createDeltaStoreConfig(deltaStoreName, phDeltaStoreConfig);
				this.deltaStoreConfigMap[deltaStoreName] = deltaStoreConfig;
				this.hasDeltaStores = true;
			}
		}
		this.hasChangeLists = false;
		let defaultPhChangeListConfig;
		let defaultPhEntityConfig;
		if (config.default) {
			defaultPhChangeListConfig = config.default.changeList;
			defaultPhEntityConfig = config.default.entity;
		}
		if (config.changeLists) {
			for (let changeListName in config.changeLists) {
				let phChangeListConfig = config.changeLists[changeListName];
				let changeListConfig = new ChangeListConfig(changeListName, phChangeListConfig, defaultPhChangeListConfig, this.deltaStoreConfigMap);
				let deltaStoreConfig = this.deltaStoreConfigMap[changeListConfig.deltaStoreName];
				deltaStoreConfig.changeListConfigMap[changeListName] = changeListConfig;
				this.changeListConfigMap[changeListName] = changeListConfig;
				this.hasChangeLists = true;
			}
			if (this.hasChangeLists) {
				if (!config.offlineDeltaStore) {
					throw `OfflineDeltaStore must be specified if changeLists are specified.`;
				}
				if (!this.hasDeltaStores) {
					throw `Delta stores must be specified if changeLists are specified`
				}
			}
			this.offlineDeltaStore = new OfflineDeltaStoreConfig(config.offlineDeltaStore, this.deltaStoreConfigMap);
		}

		this.hasLocalStores = false;
		if (config.localStores) {
			for (let localStoreName in config.localStores) {
				let phLocalStoreConfig = config.localStores[localStoreName];
				let localStoreConfig = createLocalStoreConfig(localStoreName, phLocalStoreConfig);
				this.localStoreConfigMap[localStoreName] = localStoreConfig;
				this.hasLocalStores = true;
			}
		}

		if (defaultPhEntityConfig) {
			let changeListName = defaultPhEntityConfig.changeList;
			if (changeListName) {
				let defaultChangeList = this.config.changeLists[changeListName];
				if (!defaultChangeList) {
					throw `Unknown default Change List: ${changeListName}`;
				}
			}
			let localStoreName = defaultPhEntityConfig.localStore;
			if (localStoreName) {
				let defaultLocalStore = this.localStoreConfigMap[localStoreName];
				if (!defaultLocalStore) {
					throw `Unknown default Local Store: ${localStoreName}`;
				}
			}
		}
	}

	getEntityConfig(
		entity:any
	):IEntityConfig {
		let className = EntityUtils.getObjectClassName(entity);
		let constructor = entity.constructor;

		return this.getEntityConfigWithClassNameAndConstructor(className, constructor);
	}


	getEntityConfigFromQ<IQE extends IQEntity>(
		qEntity:IQE
	):IEntityConfig {
		let constructor = qEntity.__entityConstructor__;
		let className = EntityUtils.getClassName(constructor);

		return this.getEntityConfigWithClassNameAndConstructor(className, constructor);
	}

	getEntityConfigWithClassNameAndConstructor(
		className:string,
		constructor:Function
	):IEntityConfig {
		let entityConfig = this.entityConfigMap[className];
		if (!entityConfig) {
			let phEntityConfig = this.config.entities[className];
			if (!phEntityConfig) {
				phEntityConfig = {};
			}
			let entityDefault = this.config.default.entity;
			if (entityDefault) {
				if (!phEntityConfig.changeList) {
					phEntityConfig.changeList = entityDefault.changeList;
				}
				if (!phEntityConfig.localStore) {
					phEntityConfig.localStore = entityDefault.localStore;
				}
			}

			entityConfig = new EntityConfig(className, constructor, phEntityConfig, this);
			this.entityConfigMap[className] = entityConfig;
		}

		return entityConfig;
	}

}