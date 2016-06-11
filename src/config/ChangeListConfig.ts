import {
	ChangeListShareInfo, DistributionStrategy, SharingPlatformSetupInfo,
	PlatformType, deltaStore
} from "delta-store";
import {LocalStoreType} from "../localStore/LocalStoreApi";
import {IDeltaStoreConfig} from "./DeltaStoreConfig";
/**
 * Created by Papa on 5/28/2016.
 */


export interface PHChangeListConfig {
	deltaStore?:string;
	distributionStrategy?:DistributionStrategy | string;
}

export interface PHOfflineDeltaStoreConfig {
	type:LocalStoreType;
}

export interface IChangeListConfig {
	changeListInfo?:ChangeListShareInfo;
	deltaStoreConfig:IDeltaStoreConfig;
	deltaStoreName:string;
	distributionStrategy:DistributionStrategy,
}

export class ChangeListConfig implements IChangeListConfig {

	changeListInfo:ChangeListShareInfo;
	deltaStoreConfig:IDeltaStoreConfig;
	deltaStoreName:string;
	distributionStrategy:DistributionStrategy;

	constructor(
		public changeListName:string,
		private config:PHChangeListConfig,
		private defaultConfig:PHChangeListConfig,
		deltaStoreConfigMap:{[deltaStoreName:string]:IDeltaStoreConfig}
	) {
		let deltaStoreName = config.deltaStore;
		if (!deltaStoreName) {
			deltaStoreName = defaultConfig.deltaStore;
		}
		if (!deltaStoreName) {
			throw `'changeLists.${changeListName}.deltaStore' is not specified.`;
		}
		let deltaStoreConfig = deltaStoreConfigMap[deltaStoreName];
		if (!deltaStoreConfig) {
			throw `Could not find configuration for 'deltaStore': ${deltaStoreName}`;
		}
		this.deltaStoreName = deltaStoreName;
		this.deltaStoreConfig = deltaStoreConfig;

		let distributionStrategy = config.distributionStrategy;
		if (!distributionStrategy) {
			distributionStrategy = defaultConfig.distributionStrategy;
		}
		if (!distributionStrategy) {
			throw `Distribution Strategy is not defined`;
		}
		if (typeof distributionStrategy === "string") {
			this.distributionStrategy = deltaStore.distributionStrategy.getValue(<string>distributionStrategy);
		} else {
			// Verify the distributionStrategy
			deltaStore.distributionStrategy.getName(<DistributionStrategy>config.distributionStrategy);
			this.distributionStrategy = <DistributionStrategy>config.distributionStrategy;
		}

		this.changeListInfo = {
			name: changeListName
		};
	}

}

export interface IOfflineDeltaStoreConfig extends IDeltaStoreConfig {
	type:LocalStoreType;
	getOfflineChangeListName(
		deltaStoreName:string,
		changeListName:string
	):string;
}

export class OfflineDeltaStoreConfig implements IOfflineDeltaStoreConfig {

	static OFFLINE_DELTA_STORE_NAME = 'Offline';

	changeListConfigMap:{[changeListName:string]:IChangeListConfig} = {};
	setupInfo:SharingPlatformSetupInfo;
	type:LocalStoreType;

	constructor(
		private config:PHOfflineDeltaStoreConfig,
		deltaStoreConfigMap:{[className:string]:IDeltaStoreConfig}
	) {
		for (let deltaStoreName in deltaStoreConfigMap) {
			let deltaStoreConfig = deltaStoreConfigMap[deltaStoreName];
			for (let changeListName in deltaStoreConfig.changeListConfigMap) {
				let changeListConfig = deltaStoreConfig.changeListConfigMap[changeListName];
				let offlineChangeListName = this.getOfflineChangeListName(deltaStoreName, changeListName);
				this.changeListConfigMap[offlineChangeListName] = {
					changeListInfo: changeListConfig.changeListInfo,
					deltaStoreConfig: this,
					deltaStoreName: OfflineDeltaStoreConfig.OFFLINE_DELTA_STORE_NAME,
					distributionStrategy: changeListConfig.distributionStrategy
				};
			}
		}
		this.type = config.type;
		this.setupInfo = {
			platformType: PlatformType.OFFLINE
		};
	}

	getOfflineChangeListName(
		deltaStoreName:string,
		changeListName:string
	):string {
		return `${deltaStoreName}:${changeListName}`;
	}

}