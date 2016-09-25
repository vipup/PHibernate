/**
 * Created by Papa on 5/28/2016.
 */

import {createLocalStoreConfig, ILocalStoreConfig, PHLocalStoreConfig} from "./LocalStoreConfig";
import {
	PHDeltaStoreConfig, IDeltaStoreConfig, createDeltaStoreConfig,
	PHGoogleDeltaStoreConfig
} from "./DeltaStoreConfig";
import {IQEntity} from "querydsl-typescript";
import {DistributionStrategy, PlatformType} from "delta-store/lib/index";
import {LocalStoreType} from "../localStore/LocalStoreApi";
import {EntityUtils} from "../shared/EntityUtils";
import {IdGeneration} from "../localStore/IdGenerator";

export interface PHPersistenceConfig<DSC extends PHDeltaStoreConfig> {
	appName:string;
	deltaStore?:DSC;
	localStore?:PHLocalStoreConfig;
}

export interface IPersistenceConfig {

	deltaStoreConfig:IDeltaStoreConfig;
	localStoreConfig:ILocalStoreConfig;

}

export class PersistenceConfig<DSC extends PHDeltaStoreConfig> implements IPersistenceConfig {

	static getDefaultPHConfig(
		appName:string = 'DefaultApp',
		distributionStrategy:DistributionStrategy = DistributionStrategy.S3_SECURE_POLL,
		deltaStorePlatform:PlatformType = PlatformType.GOOGLE,
		localStoreType:LocalStoreType = LocalStoreType.SQLITE_CORDOVA,
		offlineDeltaStoreType:LocalStoreType = LocalStoreType.SQLITE_CORDOVA,
		idGeneration:IdGeneration = IdGeneration.ENTITY_CHANGE_ID
	):PHPersistenceConfig<PHDeltaStoreConfig> {
		return {
			appName: appName,
			deltaStore: {
				changeList: {
					distributionStrategy: distributionStrategy
				},
				offlineDeltaStore: {
					type: offlineDeltaStoreType
				},
				recordIdField: "id",
				platform: deltaStorePlatform
			},
			localStore: {
				type: localStoreType,
				idGeneration: idGeneration
			}
		};
	}

	deltaStoreConfig:IDeltaStoreConfig;
	localStoreConfig:ILocalStoreConfig;

	constructor(
		private config:PHPersistenceConfig<DSC>
	) {
		if (config.deltaStore) {
			let phDeltaStoreConfig = config.deltaStore;
			this.deltaStoreConfig = createDeltaStoreConfig(phDeltaStoreConfig);
		}

		if (config.localStore) {
			this.localStoreConfig = createLocalStoreConfig(config.appName, config.localStore);
		}
	}

}