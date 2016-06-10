/**
 * Created by Papa on 5/28/2016.
 */
import {LocalStoreType, localStore, LocalStoreSetupInfo} from "../localStore/LocalStoreApi";

export interface PHLocalStoreConfig {
	type:LocalStoreType | string;
}

export interface ILocalStoreConfig {
	setupInfo:LocalStoreSetupInfo;
}

export interface IPouchDbLocalStoreConfig extends ILocalStoreConfig {
}

export class PouchDbLocalStoreConfig implements IPouchDbLocalStoreConfig {

	setupInfo:LocalStoreSetupInfo;

	constructor(
		localStoreName:string,
		type:LocalStoreType
	) {

		this.setupInfo = {
			name: localStoreName,
			type: type
		};
	}
}

export function createLocalStoreConfig(
	localStoreName:string,
	config:PHLocalStoreConfig
):ILocalStoreConfig {
	if (!config.type) {
		throw `Local Store Type is not specified`;
	}

	let type:LocalStoreType;

	if (typeof config.type === "string") {
		type = localStore.type.getValue(<string>config.type);
	} else {
		// Verify the type
		localStore.type.getName(<LocalStoreType>config.type);
		type = <LocalStoreType>config.type;
	}

	switch (type) {
		case LocalStoreType.POUCH_DB:
			return new PouchDbLocalStoreConfig(localStoreName, <LocalStoreType>config.type);
		default:
			throw `Unsupported LocalStoreType: ${type}`;
	}
}