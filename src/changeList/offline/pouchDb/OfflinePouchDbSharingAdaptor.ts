/**
 * Created by Papa on 5/28/2016.
 */

import {PlatformType, SharingAdaptor, SharedChangeList, GoogleSetupInfo} from "delta-store";
import {OfflinePouchDbSetupInfo, OfflinePouchDbChangeListShareInfo} from "./OfflinePouchDbSharingModel";

export class OfflinePouchDbSharingAdaptor implements SharingAdaptor {

	initialize(
		setupInfo:OfflinePouchDbSetupInfo
	):Promise<any> {
		return null;
	}

	findExistingChangeLists(
		setupInfo:OfflinePouchDbSetupInfo
	):Promise<OfflinePouchDbChangeListShareInfo[]> {
		return null;
	}

	createChangeList(
		name:string,
		setupInfo:OfflinePouchDbSetupInfo
	):Promise<SharedChangeList> {
		return null;
	}

	loadChangeList(
		shareInfo:OfflinePouchDbChangeListShareInfo
	):Promise<SharedChangeList> {
		return null;
	}


	setupInfoBelongsTo(
		setupInfo:OfflinePouchDbSetupInfo,
		setupInfos:OfflinePouchDbSetupInfo[]
	):boolean {
		if (setupInfo.platformType !== PlatformType.OFFLINE) {
			return false;
		}
		return setupInfos.some((
			otherSetupInfo:GoogleSetupInfo
		) => {
			if (otherSetupInfo.platformType === PlatformType.OFFLINE) {
				return setupInfo.apiKey === otherSetupInfo.apiKey
					&& setupInfo.clientId === otherSetupInfo.clientId;
			}
		})
	}

}