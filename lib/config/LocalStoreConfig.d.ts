/**
 * Created by Papa on 5/28/2016.
 */
import { LocalStoreType, LocalStoreSetupInfo } from "../localStore/LocalStoreApi";
import { IdGeneration } from "../localStore/IdGenerator";
export interface PHLocalStoreConfig {
    type: LocalStoreType | string;
    idGeneration: IdGeneration;
}
export interface ILocalStoreConfig {
    setupInfo: LocalStoreSetupInfo;
}
export declare class CommonLocalStoreConfig implements ILocalStoreConfig {
    setupInfo: LocalStoreSetupInfo;
    constructor(localStoreName: string, type: LocalStoreType, idGeneration: IdGeneration);
}
export declare function createLocalStoreConfig(localStoreName: string, config: PHLocalStoreConfig): ILocalStoreConfig;
export interface IPouchDbLocalStoreConfig extends ILocalStoreConfig {
}
export declare class PouchDbLocalStoreConfig extends CommonLocalStoreConfig implements IPouchDbLocalStoreConfig {
}
export interface ISqLiteCordovaLocalStoreConfig extends ILocalStoreConfig {
}
export declare class SqLiteCordovaLocalStoreConfig extends CommonLocalStoreConfig implements SqLiteCordovaLocalStoreConfig {
}
