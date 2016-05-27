import {DistributionStrategy, SharingPlatformSetupInfo, ShareInfo, ChangeListShareInfo} from "delta-store/lib/SharingAdaptor";
/**
 * Created by Papa on 5/25/2016.
 */


export interface IPeristenceConfDef {
	appName:string;
	entityCommon:{[name:string]:IEntityConfDef};
	entities?:{[name:string]:IEntityConfDef};
	changeLists:{[refName:string]:IChangeListConfDef};
	localStores:{[refName:string]:ILocalStoreConfDef};
}

export interface IEntityConfDef {
	changeListRef?:string;
	clazz?:any;
	localStoreRef?:string;
	name?:string;
}

export interface IChangeListConfDef {
	changeListInfo?:ChangeListShareInfo;
	distributionStrategy:DistributionStrategy,
	refName?:string;
	setupInfo?:SharingPlatformSetupInfo;
	shareInfo?:ShareInfo;
}

export interface ILocalStoreConfDef {
	refName:string;
	instanceName:string;
}

export interface IPersistenceConfiguration {
	changeList:boolean;
}

export class PersistenceConfiguration {

	constructor(
		private definition:IPeristenceConfDef
	) {

	}

	getConfiguration(
		entity:any
	) {
		let className = this.getObjectClassName(entity);
	}

	getObjectClassName(
		object:any
	):string {
		if (typeof object != "object" || object === null) {
			return `Provide object is not an object or is null`;
		}
		let className = /(\w+)\(/.exec(object.constructor.toString())[1];

		return className;
	}

}