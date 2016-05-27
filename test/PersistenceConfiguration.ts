/**
 * Created by Papa on 5/27/2016.
 */

import {IPeristenceConfDef} from "../src/core/repository/PersistenceConfiguration";
import {DistributionStrategy, ShareInfo} from "delta-store/lib/SharingAdaptor";

export var PERSISTENCE_CONFIGURATION:IPeristenceConfDef = {
	appName: "Goals'n'Tasks",
	entityCommon: {
		changeListRef: "GoalsNTasks",
		localStoreRef: "GoalsNTasks"
	},
	changeLists:{
		"GoogleDrive": {
			distributionStrategy: DistributionStrategy.S3_SECURE_POLL,
			setupInfo: {
				rootResource: "GoalsNTasks",
				shareInfo: ShareInfo.GOOGLE
			}
		}
	}
};