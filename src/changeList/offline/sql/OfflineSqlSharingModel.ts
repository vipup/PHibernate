/**
 * Created by Papa on 5/28/2016.
 */
import {SharingPlatformSetupInfo, ChangeListShareInfo} from "delta-store";

export interface OfflineSqlSetupInfo extends SharingPlatformSetupInfo {
	apiKey:string;
	clientId:string;
	sharedAppFolderId?:string;
}

export interface OfflineSqlChangeListShareInfo extends ChangeListShareInfo {
	folderId:string;
	realtimeFileId?:string;
	recentFileId?:string;
	archiveFileId?:string;
}