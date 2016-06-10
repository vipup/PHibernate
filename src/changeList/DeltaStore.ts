/**
 * Created by Papa on 5/27/2016.
 */
import {
	GoogleApi,
	GoogleDrive,
	GoogleDriveAdaptor,
	GoogleRealtime,
	GoogleRealtimeAdaptor,
	GoogleSharingAdaptor,
	PlatformType,
	SharingAdaptor, SharedChangeList, ChangeListShareInfo
} from "delta-store";
import {IDeltaStoreConfig} from "../config/DeltaStoreConfig";
import {IChangeListConfig} from "../config/ChangeListConfig";


export interface IDeltaStore {
	changeListMap:{[changeListName:string]:SharedChangeList};
	config:IDeltaStoreConfig;
	sharingAdaptor:SharingAdaptor;
	goOffline():void;
	goOnline():Promise<any>;
}

export class DeltaStore implements IDeltaStore {

	changeListMap:{[changeListName:string]:SharedChangeList} = {};

	constructor(
		public config:IDeltaStoreConfig,
		public sharingAdaptor:SharingAdaptor = null
	) {
	}

	goOffline() {
		this.changeListMap = {};
	}

	async goOnline():Promise<any> {
		await this.sharingAdaptor.initialize(this.config.setupInfo);
		await this.setupChangeLists();
	}

	async setupChangeLists():Promise<any> {

		await this.loadChangeLists();

		let remoteLoadOps:Promise<any>[] = [];
		let changeListConfigs:IChangeListConfig[] = [];

		for (let changeListName in this.config.changeListConfigMap) {
			let changeListConfig = this.config.changeListConfigMap[changeListName];

			let existingChangeListConfig = this.config.changeListConfigMap[changeListName];
			let remoteLoadOp;
			if (existingChangeListConfig) {
				changeListConfig = existingChangeListConfig;
				remoteLoadOp = this.sharingAdaptor.loadChangeList(changeListConfig.changeListInfo);
			} else {
				remoteLoadOp = this.sharingAdaptor.createChangeList(changeListName, this.config.setupInfo);
			}

			changeListConfigs.push(changeListConfig);
			remoteLoadOps.push(remoteLoadOp);
		}

		let loadResponses = await Promise.all(remoteLoadOps);

		changeListConfigs.forEach((
			changeListConfig:IChangeListConfig,
			index:number
		) => {
			let changeList:SharedChangeList = <any>loadResponses[index];
			this.changeListMap[changeListConfig.changeListInfo.name] = changeList;
		});

		return null;
	}

	private async loadChangeLists():Promise<any> {

		let changeLists:ChangeListShareInfo[] = await this.sharingAdaptor.findExistingChangeLists(this.config.setupInfo);
		changeLists.forEach((
			changeListShareInfo:ChangeListShareInfo
		) => {
			let changeListName = changeListShareInfo.name;
			let changeListConfig = this.config.changeListConfigMap[changeListName];
			changeListConfig.changeListInfo = changeListShareInfo;
		});

		return null;
	}

}

var GOOGLE_SHARING_ADAPTOR;

export function getSharingAdaptor(
	platformType:PlatformType
):SharingAdaptor {
	switch (platformType) {
		case PlatformType.GOOGLE:
			if (!GOOGLE_SHARING_ADAPTOR) {
				GOOGLE_SHARING_ADAPTOR = getGooglesSharingAdaptor();
			}
			return GOOGLE_SHARING_ADAPTOR;
		default:
			throw `Unsupported PlatformType: ${platformType}`;
	}
}


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