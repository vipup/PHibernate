/**
 * Created by Papa on 5/28/2016.
 */

import {PlatformType, SharingAdaptor, SharedChangeList, GoogleSetupInfo} from "delta-store";
import {OfflineSqlSetupInfo, OfflineSqlChangeListShareInfo} from "./OfflineSqlSharingModel";

export class OfflineSqlSharingAdaptor implements SharingAdaptor {

	initialize(
		setupInfo:OfflineSqlSetupInfo
	):Promise<any> {
		return null;
	}

	findExistingChangeLists(
		setupInfo:OfflineSqlSetupInfo
	):Promise<OfflineSqlChangeListShareInfo[]> {
		return null;
	}

	createChangeList(
		name:string,
		setupInfo:OfflineSqlSetupInfo
	):Promise<SharedChangeList> {
		return null;
	}

	loadChangeList(
		setupInfo:OfflineSqlSetupInfo,
		shareInfo:OfflineSqlChangeListShareInfo
	):Promise<SharedChangeList> {
		return null;
	}


	setupInfoBelongsTo(
		setupInfo:OfflineSqlSetupInfo,
		setupInfos:OfflineSqlSetupInfo[]
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