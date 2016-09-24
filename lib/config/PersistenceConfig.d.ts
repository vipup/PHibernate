import { ILocalStoreConfig, PHLocalStoreConfig } from "./LocalStoreConfig";
import { PHDeltaStoreConfig, IDeltaStoreConfig } from "./DeltaStoreConfig";
import { DistributionStrategy, PlatformType } from "delta-store/lib/index";
import { LocalStoreType } from "../localStore/LocalStoreApi";
import { IdGeneration } from "../localStore/IdGenerator";
export interface PHPersistenceConfig<DSC extends PHDeltaStoreConfig> {
    appName: string;
    deltaStore?: DSC;
    localStore?: PHLocalStoreConfig;
}
export interface IPersistenceConfig {
    deltaStoreConfig: IDeltaStoreConfig;
    localStoreConfig: ILocalStoreConfig;
}
export declare class PersistenceConfig<DSC extends PHDeltaStoreConfig> implements IPersistenceConfig {
    private config;
    static getDefaultPHConfig(appName?: string, distributionStrategy?: DistributionStrategy, deltaStorePlatform?: PlatformType, localStoreType?: LocalStoreType, offlineDeltaStoreType?: LocalStoreType, idGeneration?: IdGeneration): PHPersistenceConfig<PHDeltaStoreConfig>;
    deltaStoreConfig: IDeltaStoreConfig;
    localStoreConfig: ILocalStoreConfig;
    constructor(config: PHPersistenceConfig<DSC>);
}
