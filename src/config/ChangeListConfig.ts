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
	type:LocalStoreType;
}

export interface IChangeListConfig {
	changeListInfo?:ChangeListShareInfo;
	deltaStoreConfig:IDeltaStoreConfig;
	distributionStrategy:DistributionStrategy;
	exists?:boolean;
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
			name: 'ChangeGroups'
		};
	}

}

export interface IOfflineDeltaStoreConfig {
	// changeListConfig:IChangeListConfig;
	config:PHOfflineDeltaStoreConfig;
	type:LocalStoreType;
}

export class OfflineDeltaStoreConfig implements IOfflineDeltaStoreConfig {

	// changeListConfig:IChangeListConfig;
	setupInfo:SharingPlatformSetupInfo;
	type:LocalStoreType;

	constructor(
		public config:PHOfflineDeltaStoreConfig,
		deltaStoreConfig:IDeltaStoreConfig
	) {
		let changeListConfig = deltaStoreConfig.changeListConfig;
		this.type = config.type;
		this.setupInfo = {
			platformType: PlatformType.OFFLINE,
			recordIdField: deltaStoreConfig.config.recordIdField
		};
	}

}