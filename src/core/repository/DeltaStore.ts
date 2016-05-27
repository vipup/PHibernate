/**
 * Created by Papa on 5/27/2016.
 */
import {GoogleApi} from "delta-store/lib/google/GoogleApi";
import {GoogleDrive} from "delta-store/lib/google/drive/GoogleDrive";
import {GoogleDriveAdaptor} from "delta-store/lib/google/drive/GoogleDriveAdaptor";
import {GoogleRealtime} from "delta-store/lib/google/realtime/GoogleRealtime";
import {GoogleRealtimeAdaptor} from "delta-store/lib/google/realtime/GoogleRealtimeAdaptor";
import {GoogleSharingAdaptor} from "delta-store/lib/google/GoogleSharingAdaptor";
import {ShareInfo, SharingAdaptor} from "delta-store/lib/SharingAdaptor";

export function getSharingAdaptor(
	shareInfo:ShareInfo
):SharingAdaptor {
	switch (shareInfo) {
		case ShareInfo.GOOGLE:
			return GOOGLE_SHARING_ADAPTOR;
		default:
			throw `Unsupported shareInfo: ${shareInfo}`;
	}
}

const GOOGLE_SHARING_ADAPTOR = getGooglesSharingAdaptor();

export function getGooglesSharingAdaptor():GoogleSharingAdaptor {
	let googleApi = getGoogleApi();
	let googleDrive = getGoogleDrive(googleApi);
	let googleDriveAdaptor = getGoogleDriveAdaptor(googleApi, googleDrive);
	let googleRealtime = getGoogleRealtime(googleDrive);
	let googleRealtimeAdaptor = getGoogleRealtimeAdaptor(googleRealtime);
	let googleSharingAdaptor = getGoogleSharingAdaptor(googleDrive, googleDriveAdaptor, googleRealtime, googleRealtimeAdaptor);

	return googleSharingAdaptor;
}

function getGoogleApi():GoogleApi {
	return new GoogleApi();
}

function getGoogleDrive(
	googleApi:GoogleApi
):GoogleDrive {
	return new GoogleDrive(googleApi);
}

function getGoogleDriveAdaptor(
	googleApi:GoogleApi,
	googleDrive:GoogleDrive
):GoogleDriveAdaptor {
	return new GoogleDriveAdaptor(googleApi, googleDrive);
}

function getGoogleRealtime(
	googleDrive:GoogleDrive
):GoogleRealtime {
	return new GoogleRealtime(googleDrive);
}

function getGoogleRealtimeAdaptor(
	googleRealtime:GoogleRealtime
):GoogleRealtimeAdaptor {
	return new GoogleRealtimeAdaptor(googleRealtime);
}

function getGoogleSharingAdaptor(
	googleDrive:GoogleDrive,
	googleDriveAdaptor:GoogleDriveAdaptor,
	googleRealtime:GoogleRealtime,
	googleRealtimeAdaptor:GoogleRealtimeAdaptor
):GoogleSharingAdaptor {
	return new GoogleSharingAdaptor(googleDrive, googleDriveAdaptor, googleRealtime, googleRealtimeAdaptor);
}