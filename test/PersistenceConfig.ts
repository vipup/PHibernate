/**
 * Created by Papa on 5/27/2016.
 */

import {PHPersistenceConfig} from "../src/config/PersistenceConfig";
import {LocalStoreType} from "../src/config/LocalStoreConfig";
import {DistributionStrategy, PlatformType} from "delta-store/lib/SharingAdaptor";
import {IdGeneration} from "../src/localStore/IdGenerator";

export var PERSISTENCE_CONFIG: PHPersistenceConfig = {
	appName: "DefaultApp",
	changeList: {
		distributionStrategy: DistributionStrategy.S3_SECURE_POLL
	},
	deltaStore: {
		apiKey: null,
		clientId: null,
		platform: PlatformType.GOOGLE,
		rootDir: "PHibernate"
	},
	localStore: {
		platform: LocalStoreType.SQLITE_CORDOVA,
		idGeneration: IdGeneration.ENTITY_CHANGE_ID
	},
	offlineDeltaStore: {
		type: LocalStoreType.SQLITE_CORDOVA
	}
};