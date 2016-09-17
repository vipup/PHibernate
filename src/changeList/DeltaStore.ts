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
import {ChangeGroup} from "./model/ChangeGroup";
import {UserUtils} from "../shared/UserUtils";
import {PlatformUtils} from "../shared/PlatformUtils";
import {EntityChangeDao} from "./dao/EntityChangeDao";
import {EntityChange} from "./model/EntityChange";
import {AbstractFieldChange} from "./model/AbstractFieldChange";
import {BooleanFieldChange} from "./model/BooleanFieldChange";
import {StringFieldChange} from "./model/StringFieldChange";
import {NumberFieldChange} from "./model/NumberFieldChange";
import {DateFieldChange} from "./model/DateFieldChange";


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

	static getNewChangeGroup():ChangeGroup {
		let changeGroup = new ChangeGroup();

		let createDate = new Date();
		let deviceId = PlatformUtils.getDeviceAddress();
		let userId = UserUtils.getUserId();

		changeGroup.id = ChangeGroup.getId(deviceId, createDate, userId);
		changeGroup.createDateTime = createDate;
		changeGroup.createDeviceId = deviceId;
		changeGroup.createUserId = userId;
		changeGroup.numberOfEntitiesInGroup = 0;

		return changeGroup;
	}

	static getNewEntityChange(changeGroup:ChangeGroup):EntityChange {
		let entityChange = new EntityChange();
		entityChange.entityIdInGroup = ++changeGroup.numberOfEntitiesInGroup;
		entityChange.numberOfFieldsInEntity = 0;

		entityChange.id = EntityChange.getEntityChangeId(entityChange.entityIdInGroup, changeGroup.createDeviceId, changeGroup.createDateTime, changeGroup.createUserId);
		entityChange.createDateTime = changeGroup.createDateTime;
		entityChange.createDeviceId = changeGroup.createDeviceId;
		entityChange.createUserId = changeGroup.createUserId;

		return entityChange;
	}

	static getNewBooleanFieldChange(entityChange:EntityChange):BooleanFieldChange {
		let booleanFieldChange = new BooleanFieldChange();

		return this.getNewFieldChange(entityChange, booleanFieldChange);
	}

	static getNewDateFieldChange(entityChange:EntityChange):DateFieldChange {
		let dateFieldChange = new DateFieldChange();

		return this.getNewFieldChange(entityChange, dateFieldChange);
	}

	static getNewNumberFieldChange(entityChange:EntityChange):NumberFieldChange {
		let numberFieldChange = new NumberFieldChange();

		return this.getNewFieldChange(entityChange, numberFieldChange);
	}

	static getNewStringFieldChange(entityChange:EntityChange):StringFieldChange {
		let stringFieldChange = new StringFieldChange();

		return this.getNewFieldChange(entityChange, stringFieldChange);
	}

	static getNewFieldChange<C extends AbstractFieldChange>(
		entityChange:EntityChange,
		fieldChange:C
	):C {
		fieldChange.fieldIdInEntity = ++entityChange.numberOfFieldsInEntity;
		fieldChange.entityIdInGroup = entityChange.entityIdInGroup;

		fieldChange.id = AbstractFieldChange.getFieldChangeId(fieldChange.fieldIdInEntity, entityChange.entityIdInGroup, entityChange.createDeviceId, entityChange.createDateTime, entityChange.createUserId);
		fieldChange.createDateTime = entityChange.createDateTime;
		fieldChange.createDeviceId = entityChange.createDeviceId;
		fieldChange.createUserId = entityChange.createUserId;

			return fieldChange;
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
				remoteLoadOp = this.sharingAdaptor.loadChangeList(this.config.setupInfo, changeListConfig.changeListInfo);
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