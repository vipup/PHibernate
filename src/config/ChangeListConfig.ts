import {
	ChangeListShareInfo, DistributionStrategy, SharingPlatformSetupInfo,
	PlatformType, deltaStore
} from "delta-store";
import {LocalStoreType} from "../localStore/LocalStoreApi";
import {IDeltaStoreConfig, PHDeltaStoreConfig} from "./DeltaStoreConfig";
/**
 * Created by Papa on 5/28/2016.
 */


export interface PHChangeListConfig {
	distributionStrategy?:DistributionStrategy | string;
}

export interface PHOfflineDeltaStoreConfig {
	name?:string;
	type:LocalStoreType;
}

export interface IChangeListConfig {
	changeListInfo?:ChangeListShareInfo;
	deltaStoreConfig:IDeltaStoreConfig;
	distributionStrategy:DistributionStrategy,
}

export class ChangeListConfig implements IChangeListConfig {

	changeListInfo:ChangeListShareInfo;
	distributionStrategy:DistributionStrategy;

	constructor(
		private config:PHChangeListConfig,
		public deltaStoreConfig:IDeltaStoreConfig
	) {
		this.deltaStoreConfig = deltaStoreConfig;

		let distributionStrategy = config.distributionStrategy;
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
			name: deltaStoreConfig.config.name,
			idField: deltaStoreConfig.config.recordIdField
		};
	}

}

export interface IOfflineDeltaStoreConfig {
	changeListConfig:IChangeListConfig;
	config:PHOfflineDeltaStoreConfig;
	type:LocalStoreType;
	getOfflineChangeListName(
		deltaStoreName:string,
		changeListName:string
	):string;
}

export class OfflineDeltaStoreConfig implements IOfflineDeltaStoreConfig {

	static OFFLINE_DELTA_STORE_NAME = 'Offline';

	changeListConfig:IChangeListConfig;
	setupInfo:SharingPlatformSetupInfo;
	type:LocalStoreType;

	constructor(
		public config:PHOfflineDeltaStoreConfig,
		deltaStoreConfig:IDeltaStoreConfig
	) {
		let changeListConfig = deltaStoreConfig.changeListConfig;
		let offlineChangeListName = this.getOfflineChangeListName(deltaStoreConfig.config.name, changeListConfig.changeListInfo.name);
		this.changeListConfig = {
			changeListInfo: changeListConfig.changeListInfo,
			deltaStoreConfig: this,
			distributionStrategy: changeListConfig.distributionStrategy
		};
		this.type = config.type;
		this.setupInfo = {
			idField: deltaStoreConfig.config.recordIdField,
			platformType: PlatformType.OFFLINE,
		};
	}

	getOfflineChangeListName(
		deltaStoreName:string,
		changeListName:string
	):string {
		return `${deltaStoreName}:${changeListName}`;
	}

}