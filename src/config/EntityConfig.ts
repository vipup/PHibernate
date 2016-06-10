/**
 * Created by Papa on 5/28/2016.
 */
import {ILocalStoreConfig} from "./LocalStoreConfig";
import {IChangeListConfig} from "./ChangeListConfig";
import {IPersistenceConfig} from "./PersistenceConfig";

export interface PHEntityConfig {
	changeList?:string;
	localStore?:string;
}

export interface IEntityConfig {
	changeListConfig?:IChangeListConfig;
	className?:string;
	clazz?:any;
	localStoreConfig?:ILocalStoreConfig;
}

export class EntityConfig implements IEntityConfig {

	static getObjectClassName(
		object:any
	):string {
		if (typeof object != "object" || object === null) {
			throw `Not an object instance`;
		}
		return this.getClassName(object.constructor);
	}

	static getClassName(
		clazz:Function
	):string {
		if (typeof clazz != "function") {
			throw `Not a constructor function`;
		}

		let className = clazz['name'];
		// let className = /(\w+)\(/.exec(clazz.toString())[1];

		return className;
	}

	changeListConfig:IChangeListConfig;
	localStoreConfig:ILocalStoreConfig;

	constructor(
		public className:string,
		public clazz:Function,
		private config:PHEntityConfig,
		private persistenceConfig:IPersistenceConfig //
	) {
		if (!config) {
			throw `Entity Configuration not specified`;
		}
		let changeListName = config.changeList;
		if (changeListName) {
			let changeListConfig = persistenceConfig.changeListConfigMap[changeListName];
			if (!changeListConfig) {
				throw `Unknown Change List: ${changeListName} for Entity ${className}`;
			}
			this.changeListConfig = changeListConfig;
		}
		let localStoreName = config.localStore;
		if (localStoreName) {
			let localStoreConfig = persistenceConfig.localStoreConfigMap[localStoreName];
			if (!localStoreConfig) {
				throw `Unknown Local Store: ${localStoreName} for Entity ${className}`;
			}
			this.localStoreConfig = localStoreConfig;
		}

		if(!this.changeListConfig && !this.localStoreConfig) {
			throw `Entity Configuration does not specify a Change List or a Local Store`;
		}
	}

}