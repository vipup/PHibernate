/**
 * Created by Papa on 5/31/2016.
 */
import { GoogleSetupInfo, PlatformType, SharingPlatformSetupInfo } from "delta-store";
import { IChangeListConfig, PHChangeListConfig } from "./ChangeListConfig";
import { IOfflineDeltaStoreConfig, PHOfflineDeltaStoreConfig } from "./OfflineDeltaStoreConfig";
export interface PHDeltaStoreConfig {
    changeList?: PHChangeListConfig;
    offlineDeltaStore?: PHOfflineDeltaStoreConfig;
    platform: PlatformType | string;
    recordIdField: string;
}
export interface PHGoogleDeltaStoreConfig extends PHDeltaStoreConfig {
    apiKey: string;
    clientId: string;
    rootFolder: string;
}
export interface IDeltaStoreConfig {
    changeListConfig: IChangeListConfig;
    config: PHDeltaStoreConfig;
    offlineDeltaStore: IOfflineDeltaStoreConfig;
    setupInfo: SharingPlatformSetupInfo;
}
export declare class DeltaStoreConfig implements IDeltaStoreConfig {
    config: PHDeltaStoreConfig;
    changeListConfig: IChangeListConfig;
    offlineDeltaStore: IOfflineDeltaStoreConfig;
    setupInfo: SharingPlatformSetupInfo;
    constructor(config: PHDeltaStoreConfig);
}
export declare function getPlatformType(platform: PlatformType | string): PlatformType;
export interface IGoogleDeltaStoreConfig extends IDeltaStoreConfig {
    setupInfo: GoogleSetupInfo;
}
export declare class GoogleDeltaStoreConfig extends DeltaStoreConfig implements IGoogleDeltaStoreConfig {
    setupInfo: GoogleSetupInfo;
    constructor(config: PHGoogleDeltaStoreConfig);
}
export declare function createDeltaStoreConfig(phDeltaStoreConfig: PHDeltaStoreConfig): IDeltaStoreConfig;
