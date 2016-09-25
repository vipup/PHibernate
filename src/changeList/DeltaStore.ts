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
	SharingAdaptor, SharedChangeList, ChangeListShareInfo, ChangeRecord
} from "delta-store";
import {IDeltaStoreConfig} from "../config/DeltaStoreConfig";
import {IChangeListConfig} from "../config/ChangeListConfig";

export interface IDeltaStore {
	config:IDeltaStoreConfig;
	sharingAdaptor:SharingAdaptor;
	addChange<E>(
		changeListConfig:IChangeListConfig,
		changeRecord:E
	):Promise<E>;
	getChangeList(
		changeListConfig:IChangeListConfig
	):SharedChangeList;
	getChangeListName(
		changeListConfig:IChangeListConfig
	):string;
	goOffline():void;
	goOnline():Promise<any>;
}

export class DeltaStore implements IDeltaStore {

	batchChanges:boolean;
	protected changeListMap:{[changeListName:string]:SharedChangeList} = {};
	protected batchedChangeMap:{[changeListName:string]:ChangeRecord[]} = {};

	constructor(
		public config:IDeltaStoreConfig,
		public sharingAdaptor:SharingAdaptor = null
	) {
	}

	async addChange<E>(
		changeListConfig:IChangeListConfig,
		changeRecord:E
	):Promise<E> {
		if (this.batchChanges) {
			let changeListName = this.getChangeListName(changeListConfig);
			let batchedChangeQueue = this.batchedChangeMap[changeListName];
			if (!batchedChangeQueue) {
				batchedChangeQueue = [];
				this.batchedChangeMap[changeListName] = batchedChangeQueue;
			}
			batchedChangeQueue.push(changeRecord);
			return changeRecord;
		} else {
			let changeList = this.getChangeList(changeListConfig);
			return await changeList.addChanges([changeRecord]);
		}
	}

	getChangeListName(
		changeListConfig:IChangeListConfig
	):string {
		return changeListConfig.changeListInfo.name;
	}

	getChangeList(
		changeListConfig:IChangeListConfig
	):SharedChangeList {
		let changeListName = this.getChangeListName(changeListConfig);
		let changeList = this.changeListMap[changeListName];

		return changeList;
	}

	goOffline():void {
		this.changeListMap = {};
	}

	async goOnline():Promise<any> {
		await this.sharingAdaptor.initialize(this.config.setupInfo);
		await this.setupChangeLists();
	}

	private async setupChangeLists():Promise<any> {

		await this.loadChangeLists();

		let remoteLoadOps:Promise<any>[] = [];
		let changeListConfigs:IChangeListConfig[] = [];

			let changeListConfig = this.config.changeListConfig;

			let existingChangeListConfig = this.config.changeListConfig;
			let remoteLoadOp;
			if (this.config.changeListConfig.exists) {
				remoteLoadOp = this.sharingAdaptor.loadChangeList(this.config.setupInfo, changeListConfig.changeListInfo);
			} else {
				remoteLoadOp = this.sharingAdaptor.createChangeList(changeListConfig.changeListInfo.name, this.config.setupInfo);
				this.config.changeListConfig.exists = true;
			}

			changeListConfigs.push(changeListConfig);
			remoteLoadOps.push(remoteLoadOp);

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
		let changeListConfig = this.config.changeListConfig;
		changeLists.some((
			changeListShareInfo:ChangeListShareInfo
		) => {
			if (changeListShareInfo.name === changeListConfig.changeListInfo.name) {
				changeListConfig.exists = true;
				changeListConfig.changeListInfo = changeListShareInfo;
				return true;
			}
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