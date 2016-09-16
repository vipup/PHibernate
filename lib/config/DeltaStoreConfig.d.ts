/**
 * Created by Papa on 5/31/2016.
 */
import { GoogleSetupInfo, PlatformType, SharingPlatformSetupInfo } from "delta-store";
import { IChangeListConfig } from "./ChangeListConfig";
export interface PHDeltaStoreConfig {
    changeTimeField: string;
    changeTypeField: string;
    changeUserField: string;
    platform: PlatformType | string;
    recordIdField: string;
}
export interface PHGoogleDeltaStoreConfig extends PHDeltaStoreConfig {
    apiKey: string;
    clientId: string;
    rootFolder: string;
}
export interface IDeltaStoreConfig {
    changeListConfigMap: {
        [changeListName: string]: IChangeListConfig;
    };
    setupInfo: SharingPlatformSetupInfo;
}
export declare class DeltaStoreConfig implements IDeltaStoreConfig {
    deltaStoreName: string;
    changeListConfigMap: {
        [changeListName: string]: IChangeListConfig;
    };
    setupInfo: SharingPlatformSetupInfo;
    constructor(deltaStoreName: string, config: PHDeltaStoreConfig);
}
export declare function getPlatformType(platform: PlatformType | string): PlatformType;
export interface IGoogleDeltaStoreConfig extends IDeltaStoreConfig {
    setupInfo: GoogleSetupInfo;
}
export declare class GoogleDeltaStoreConfig extends DeltaStoreConfig implements IGoogleDeltaStoreConfig {
    private config;
    setupInfo: GoogleSetupInfo;
    constructor(deltaStoreName: string, config: PHGoogleDeltaStoreConfig);
}
export declare function createDeltaStoreConfig(deltaStoreName: string, phDeltaStoreConfig: PHDeltaStoreConfig): IDeltaStoreConfig;
