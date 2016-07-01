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
import {IChangeListConfig, IOfflineDeltaStoreConfig} from "../config/ChangeListConfig";
import {EntityProxy} from "../core/proxy/Proxies";
import {IEntityConfig} from "../config/EntityConfig";


export interface IDeltaStore {
	config:IDeltaStoreConfig;
	sharingAdaptor:SharingAdaptor;
	addChange<E>(
		entityConfig:IEntityConfig,
		entityProxy:EntityProxy
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
		entityConfig:IEntityConfig,
		entityProxy:EntityProxy
	):Promise<E> {
		let changeListConfig = entityConfig.changeListConfig;
		let changeRecord = entityProxy.__recordState__.getChangeRecord();
		if (this.batchChanges) {
			let changeListName = this.getChangeListName(changeListConfig);
			let batchedChangeQueue = this.batchedChangeMap[changeListName];
			if (!batchedChangeQueue) {
				batchedChangeQueue = [];
				this.batchedChangeMap[changeListName] = batchedChangeQueue;
			}
			batchedChangeQueue.push(changeRecord);
			return <E><any>entityProxy;
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

export class OfflineDeltaStore extends DeltaStore {

	config:IOfflineDeltaStoreConfig;

	getChangeListName(
		changeListConfig:IChangeListConfig
	):string {
		return this.config.getOfflineChangeListName(changeListConfig.deltaStoreName, changeListConfig.changeListInfo.name);
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