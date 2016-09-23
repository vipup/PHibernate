/**
 * Created by Papa on 5/31/2016.
 */

import {deltaStore, GoogleSetupInfo, PlatformType, SharingPlatformSetupInfo} from "delta-store";
import {
	IChangeListConfig, PHChangeListConfig, PHOfflineDeltaStoreConfig,
	IOfflineDeltaStoreConfig, ChangeListConfig, OfflineDeltaStoreConfig
} from "./ChangeListConfig";

export interface PHDeltaStoreConfig {
	changeList?:PHChangeListConfig;
	offlineDeltaStore?:PHOfflineDeltaStoreConfig;
	platform:PlatformType | string;
	recordIdField:string;
}

export interface PHGoogleDeltaStoreConfig extends PHDeltaStoreConfig {
	apiKey:string;
	clientId:string;
	rootFolder:string;
}

export interface IDeltaStoreConfig {
	changeListConfig:IChangeListConfig;
	config:PHDeltaStoreConfig;
	offlineDeltaStore:IOfflineDeltaStoreConfig;
	setupInfo:SharingPlatformSetupInfo;
}

export class DeltaStoreConfig implements IDeltaStoreConfig {

	changeListConfig:IChangeListConfig;
	offlineDeltaStore:IOfflineDeltaStoreConfig;
	setupInfo:SharingPlatformSetupInfo;

	constructor(
		public config:PHDeltaStoreConfig
	) {
		if (!config.platform) {
			throw `Sharing Platform is not defined`;
		}

		let platformType:PlatformType = getPlatformType(config.platform);
		this.setupInfo = {
			recordIdField: config.recordIdField,
			platformType: platformType
		};
		if (config.changeList) {
			throw `ChangeList config is not defined`;
		}
		if (!config.offlineDeltaStore) {
			throw `OfflineDeltaStore must be specified if changeLists are specified.`;
		}
		this.changeListConfig = new ChangeListConfig(config.changeList, this);
		this.offlineDeltaStore = new OfflineDeltaStoreConfig(config.offlineDeltaStore, this);
	}
}

export function getPlatformType(
	platform:PlatformType | string
):PlatformType {
	let platformType:PlatformType;
	if (typeof platform === "string") {
		platformType = deltaStore.platform.getValue(<string>platform);
	} else {
		// Verify the platform
		deltaStore.platform.getName(<PlatformType>platform);
		platformType = <PlatformType>platform;
	}

	return platformType;
}

export interface IGoogleDeltaStoreConfig extends IDeltaStoreConfig {
	setupInfo:GoogleSetupInfo;
}

export class GoogleDeltaStoreConfig extends DeltaStoreConfig implements IGoogleDeltaStoreConfig {

	setupInfo:GoogleSetupInfo;

	constructor(
		config:PHGoogleDeltaStoreConfig
	) {
		super(config);
		if (!config.rootFolder) {
			throw `Root folder is not defined`;
		}
		if (!config.apiKey) {
			throw `ApiKey is not defined`;
		}
		if (!config.clientId) {
			throw `ClientId is not defined`;
		}

		this.setupInfo.rootFolder = config.rootFolder;
		this.setupInfo.apiKey = config.apiKey;
		this.setupInfo.clientId = config.clientId;
	}
}

export function createDeltaStoreConfig(
	phDeltaStoreConfig:PHDeltaStoreConfig
):IDeltaStoreConfig {
	if (!phDeltaStoreConfig.platform) {
		throw `deltaStore.platform is nod specified`;
	}
	let platformType:PlatformType = getPlatformType(phDeltaStoreConfig.platform);

	switch (platformType) {
		case PlatformType.GOOGLE:
			return new GoogleDeltaStoreConfig(<PHGoogleDeltaStoreConfig>phDeltaStoreConfig);
		default:
			throw `Unsupported platform type ${platformType}`;
	}
}