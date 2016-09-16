/**
 * Created by Papa on 5/31/2016.
 */

import {deltaStore, GoogleSetupInfo, PlatformType, SharingPlatformSetupInfo} from "delta-store";
import {IChangeListConfig} from "./ChangeListConfig";

export interface PHDeltaStoreConfig {
	changeTimeField: string;
	changeTypeField: string;
	changeUserField: string;
	platform: PlatformType | string;
	recordIdField: string;
}

export interface PHGoogleDeltaStoreConfig extends PHDeltaStoreConfig {
	apiKey: string;
	clientId: string;
	rootFolder: string;
}

export interface IDeltaStoreConfig {
	changeListConfigMap: {[changeListName: string]: IChangeListConfig};
	setupInfo: SharingPlatformSetupInfo;
}

export class DeltaStoreConfig implements IDeltaStoreConfig {

	changeListConfigMap: {[changeListName: string]: IChangeListConfig} = {};
	setupInfo: SharingPlatformSetupInfo;

	constructor(
		public deltaStoreName: string,
		config: PHDeltaStoreConfig
	) {
		if (!config.platform) {
			throw `Sharing Platform is not defined`;
		}

		let platformType: PlatformType = getPlatformType(config.platform);
		this.setupInfo = {
			changeTimeField: config.changeTimeField,
			changeTypeField: config.changeTypeField,
			changeUserField: config.changeUserField,
			platformType: platformType,
			recordIdField: config.recordIdField
		};
	}
}

export function getPlatformType(
	platform: PlatformType | string
): PlatformType {
	let platformType: PlatformType;
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
	setupInfo: GoogleSetupInfo;
}

export class GoogleDeltaStoreConfig extends DeltaStoreConfig implements IGoogleDeltaStoreConfig {

	setupInfo: GoogleSetupInfo;

	constructor(
		deltaStoreName: string,
		private config: PHGoogleDeltaStoreConfig
	) {
		super(deltaStoreName, config);
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
	deltaStoreName: string,
	phDeltaStoreConfig: PHDeltaStoreConfig
): IDeltaStoreConfig {
	if (!phDeltaStoreConfig.platform) {
		throw `deltaStore.platform is nod specified`;
	}
	let platformType: PlatformType = getPlatformType(phDeltaStoreConfig.platform);

	switch (platformType) {
		case PlatformType.GOOGLE:
			return new GoogleDeltaStoreConfig(deltaStoreName, <PHGoogleDeltaStoreConfig>phDeltaStoreConfig);
		default:
			throw `Unsupported platform type ${platformType}`;
	}
}