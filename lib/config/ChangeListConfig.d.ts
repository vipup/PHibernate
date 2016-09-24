import { ChangeListShareInfo, DistributionStrategy, SharingPlatformSetupInfo } from "delta-store";
import { LocalStoreType } from "../localStore/LocalStoreApi";
import { IDeltaStoreConfig } from "./DeltaStoreConfig";
/**
 * Created by Papa on 5/28/2016.
 */
export interface PHChangeListConfig {
    distributionStrategy?: DistributionStrategy | string;
}
export interface PHOfflineDeltaStoreConfig {
    type: LocalStoreType;
}
export interface IChangeListConfig {
    changeListInfo?: ChangeListShareInfo;
    deltaStoreConfig: IDeltaStoreConfig;
    distributionStrategy: DistributionStrategy;
    exists?: boolean;
}
export declare class ChangeListConfig implements IChangeListConfig {
    private config;
    deltaStoreConfig: IDeltaStoreConfig;
    changeListInfo: ChangeListShareInfo;
    distributionStrategy: DistributionStrategy;
    constructor(config: PHChangeListConfig, deltaStoreConfig: IDeltaStoreConfig);
}
export interface IOfflineDeltaStoreConfig {
    config: PHOfflineDeltaStoreConfig;
    type: LocalStoreType;
}
export declare class OfflineDeltaStoreConfig implements IOfflineDeltaStoreConfig {
    config: PHOfflineDeltaStoreConfig;
    setupInfo: SharingPlatformSetupInfo;
    type: LocalStoreType;
    constructor(config: PHOfflineDeltaStoreConfig, deltaStoreConfig: IDeltaStoreConfig);
}
