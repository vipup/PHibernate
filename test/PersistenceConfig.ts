/**
 * Created by Papa on 5/27/2016.
 */

import {PHPersistenceConfig} from "../src/config/PersistenceConfig";
import {LocalStoreType} from "../src/config/LocalStoreConfig";
import {CascadeRule} from "../src/config/Rules";
import {DistributionStrategy, PlatformType} from "delta-store/lib/SharingAdaptor";

export var PERSISTENCE_CONFIG:PHPersistenceConfig = {
	appName: "DefaultApp",
	changeLists: {
		"DefaultChangeList": {}
	},
	default: {
		cascadeRule: CascadeRule.CASCADE_ALL,
		changeList: {
			distributionStrategy: DistributionStrategy.S3_SECURE_POLL,
			deltaStore: "DefaultDeltaStore"
		},
		entity: {
			changeList: "DefaultChangeList",
			localStore: "DefaultLocalStore"
		}
	},
	deltaStores: {
		"DefaultDeltaStore": {
			apiKey: null,
			clientId: null,
			platform: PlatformType.GOOGLE,
			rootDir: "PHibernate",
		}
	},
	localStores: {
		"DefaultLocalStore": {
			platform: LocalStoreType.POUCH_DB
		}
	},
	offlineDeltaStore: {
		type: LocalStoreType.POUCH_DB
	}
};