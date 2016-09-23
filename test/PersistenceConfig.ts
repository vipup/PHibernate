/**
 * Created by Papa on 5/27/2016.
 */

import {PHPersistenceConfig} from "../src/config/PersistenceConfig";
import {LocalStoreType} from "../src/config/LocalStoreConfig";
import {DistributionStrategy, PlatformType} from "delta-store/lib/SharingAdaptor";
import {IdGeneration} from "../src/localStore/IdGenerator";
import {PHGoogleDeltaStoreConfig} from "../src/config/DeltaStoreConfig";

export var PERSISTENCE_CONFIG: PHPersistenceConfig<PHGoogleDeltaStoreConfig> = {
	appName: "DefaultApp",
	deltaStore: {
		apiKey: null,
		changeList: {
			distributionStrategy: DistributionStrategy.S3_SECURE_POLL
		},
		clientId: null,
		offlineDeltaStore: {
			type: LocalStoreType.SQLITE_CORDOVA
		},
		platform: PlatformType.GOOGLE,
		rootDir: "PHibernate",
		recordIdField: "id"
	},
	localStore: {
		type: LocalStoreType.SQLITE_CORDOVA,
		idGeneration: IdGeneration.ENTITY_CHANGE_ID
	}
};