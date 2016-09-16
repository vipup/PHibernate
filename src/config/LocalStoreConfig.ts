/**
 * Created by Papa on 5/28/2016.
 */
import {LocalStoreType, localStore, LocalStoreSetupInfo} from "../localStore/LocalStoreApi";
import {IdGeneration} from "../localStore/IdGenerator";

export interface PHLocalStoreConfig {
	type: LocalStoreType | string;
	idGeneration: IdGeneration;
	entityTypeField:string;
}

export interface ILocalStoreConfig {
	setupInfo: LocalStoreSetupInfo;
}

export interface IPouchDbLocalStoreConfig extends ILocalStoreConfig {
}

export class PouchDbLocalStoreConfig extends CommonLocalStoreConfig implements IPouchDbLocalStoreConfig {

}

export interface ISqLiteCordovaLocalStoreConfig extends ILocalStoreConfig {
}

export class SqLiteCordovaLocalStoreConfig extends CommonLocalStoreConfig implements SqLiteCordovaLocalStoreConfig {

}

export class CommonLocalStoreConfig implements ILocalStoreConfig {

	setupInfo: LocalStoreSetupInfo;

	constructor(
		localStoreName: string,
		type: LocalStoreType,
		idGeneration: IdGeneration
	) {

		this.setupInfo = {
			name: localStoreName,
			type: type,
			idGeneration: idGeneration
		};
	}
}

export function createLocalStoreConfig(
	localStoreName: string,
	config: PHLocalStoreConfig
): ILocalStoreConfig {
	if (!config.type) {
		throw `Local Store Type is not specified`;
	}
	if (!config.idGeneration) {
		throw `Id Generation startegy is not specified`;
	}

	let type: LocalStoreType;

	if (typeof config.type === "string") {
		type = localStore.type.getValue(<string>config.type);
	} else {
		// Verify the type
		localStore.type.getName(<LocalStoreType>config.type);
		type = <LocalStoreType>config.type;
	}

	switch (type) {
		case LocalStoreType.SQLITE_CORDOVA:
			return new SqLiteCordovaLocalStoreConfig(localStoreName, <LocalStoreType>config.type, config.idGeneration);
		case LocalStoreType.POUCH_DB:
			throw `PouchDb is not currently supported`;
		// return new PouchDbLocalStoreConfig(localStoreName, <LocalStoreType>config.type);
		default:
			throw `Unsupported LocalStoreType: ${type}`;
	}
}