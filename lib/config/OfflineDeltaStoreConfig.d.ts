import { LocalStoreType } from "../localStore/LocalStoreApi";
import { SharingPlatformSetupInfo } from "delta-store";
import { IDeltaStoreConfig } from "./DeltaStoreConfig";
/**
 * Created by Papa on 9/24/2016.
 */
export interface PHOfflineDeltaStoreConfig {
    type: LocalStoreType;
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
