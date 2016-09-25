import {LocalStoreType} from "../localStore/LocalStoreApi";
import {SharingPlatformSetupInfo, PlatformType} from "delta-store";
import {IDeltaStoreConfig} from "./DeltaStoreConfig";
/**
 * Created by Papa on 9/24/2016.
 */

export interface PHOfflineDeltaStoreConfig {
	type:LocalStoreType;
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
