/**
 * Created by Papa on 5/27/2016.
 */

import {PHPersistenceConfig} from "../src/config/PersistenceConfig";
import {LocalStoreType} from "../src/config/LocalStoreConfig";
import {DistributionStrategy, PlatformType} from "delta-store/lib/SharingAdaptor";

export var PERSISTENCE_CONFIG:PHPersistenceConfig = {
	appName: "Goals'n'Tasks",
	changeLists: {
		"GoalsNTasks": {}
	},
	default: {
		changeList: {
			distributionStrategy: DistributionStrategy.S3_SECURE_POLL,
			deltaStore: "GoogleGoalsNTasks"
		},
		entity: {
			changeList: "GoalsNTasks",
			localStore: "GoalsNTasks"
		}
	},
	deltaStores: {
		"GoogleGoalsNTasks": {
			apiKey: null,
			clientId: null,
			platform: PlatformType.GOOGLE,
			rootDir: "GoalsNTasks",
		}
	},
	localStores: {
		"GoalsNTasks": {
			platform: LocalStoreType.POUCH_DB
		}
	},
	offlineDeltaStore: {
		type: LocalStoreType.POUCH_DB
	}
};