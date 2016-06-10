/**
 * Created by Papa on 5/28/2016.
 */
import { LocalStoreType, LocalStoreSetupInfo } from "../localStore/LocalStoreApi";
export interface PHLocalStoreConfig {
    type: LocalStoreType | string;
}
export interface ILocalStoreConfig {
    setupInfo: LocalStoreSetupInfo;
}
export interface IPouchDbLocalStoreConfig extends ILocalStoreConfig {
}
export declare class PouchDbLocalStoreConfig implements IPouchDbLocalStoreConfig {
    setupInfo: LocalStoreSetupInfo;
    constructor(localStoreName: string, type: LocalStoreType);
}
export declare function createLocalStoreConfig(localStoreName: string, config: PHLocalStoreConfig): ILocalStoreConfig;
