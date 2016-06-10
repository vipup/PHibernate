import { ChangeListShareInfo, DistributionStrategy, SharingPlatformSetupInfo } from "delta-store";
import { LocalStoreType } from "../localStore/LocalStoreApi";
import { IDeltaStoreConfig } from "./DeltaStoreConfig";
/**
 * Created by Papa on 5/28/2016.
 */
export interface PHChangeListConfig {
    deltaStore?: string;
    distributionStrategy?: DistributionStrategy | string;
}
export interface PHOfflineDeltaStoreConfig {
    type: LocalStoreType;
}
export interface IChangeListConfig {
    changeListInfo?: ChangeListShareInfo;
    deltaStoreConfig: IDeltaStoreConfig;
    deltaStoreName: string;
    distributionStrategy: DistributionStrategy;
}
export declare class ChangeListConfig implements IChangeListConfig {
    changeListName: string;
    private config;
    private defaultConfig;
    changeListInfo: ChangeListShareInfo;
    deltaStoreConfig: IDeltaStoreConfig;
    deltaStoreName: string;
    distributionStrategy: DistributionStrategy;
    constructor(changeListName: string, config: PHChangeListConfig, defaultConfig: PHChangeListConfig, deltaStoreConfigMap: {
        [deltaStoreName: string]: IDeltaStoreConfig;
    });
}
export interface IOfflineDeltaStoreConfig extends IDeltaStoreConfig {
    type: LocalStoreType;
}
export declare class OfflineDeltaStoreConfig implements IOfflineDeltaStoreConfig {
    private config;
    static OFFLINE_DELTA_STORE_NAME: string;
    changeListConfigMap: {
        [changeListName: string]: IChangeListConfig;
    };
    setupInfo: SharingPlatformSetupInfo;
    type: LocalStoreType;
    constructor(config: PHOfflineDeltaStoreConfig, deltaStoreConfigMap: {
        [className: string]: IDeltaStoreConfig;
    });
    getAsMap(): {
        [deltaStoreName: string]: OfflineDeltaStoreConfig;
    };
}
