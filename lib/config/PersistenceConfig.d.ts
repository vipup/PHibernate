/**
 * Created by Papa on 5/28/2016.
 */
import { IEntityConfig, PHEntityConfig } from "./EntityConfig";
import { ILocalStoreConfig, PHLocalStoreConfig } from "./LocalStoreConfig";
import { IChangeListConfig, PHChangeListConfig, PHOfflineDeltaStoreConfig, IOfflineDeltaStoreConfig } from "./ChangeListConfig";
import { PHDeltaStoreConfig, IDeltaStoreConfig } from "./DeltaStoreConfig";
import { IQEntity } from "querydsl-typescript/lib/index";
import { DistributionStrategy, PlatformType } from "delta-store/lib/index";
import { LocalStoreType } from "../localStore/LocalStoreApi";
export interface PHPersistenceConfig {
    appName: string;
    deltaStores?: {
        [name: string]: PHDeltaStoreConfig;
    };
    default?: {
        changeList: PHChangeListConfig;
        entity: PHEntityConfig;
    };
    entities?: {
        [name: string]: PHEntityConfig;
    };
    changeLists: {
        [refName: string]: PHChangeListConfig;
    };
    localStores: {
        [refName: string]: PHLocalStoreConfig;
    };
    offlineDeltaStore?: PHOfflineDeltaStoreConfig;
}
export interface IPersistenceConfig {
    changeListConfigMap: {
        [changeListName: string]: IChangeListConfig;
    };
    deltaStoreConfigMap: {
        [deltaStoreName: string]: IDeltaStoreConfig;
    };
    entityConfigMap: {
        [className: string]: IEntityConfig;
    };
    localStoreConfigMap: {
        [storeName: string]: ILocalStoreConfig;
    };
    hasChangeLists: boolean;
    hasDeltaStores: boolean;
    hasLocalStores: boolean;
    offlineDeltaStore: IOfflineDeltaStoreConfig;
    getEntityConfig(entity: any): IEntityConfig;
    getEntityConfigFromQ<IQE extends IQEntity<IQE>>(qEntity: IQE): IEntityConfig;
}
export declare class PersistenceConfig implements IPersistenceConfig {
    private config;
    static getDefaultPHConfig(appName?: string, distributionStrategy?: DistributionStrategy, deltaStorePlatform?: PlatformType, localStoreType?: LocalStoreType, offlineDeltaStoreType?: LocalStoreType): PHPersistenceConfig;
    changeListConfigMap: {
        [changeListName: string]: IChangeListConfig;
    };
    deltaStoreConfigMap: {
        [className: string]: IDeltaStoreConfig;
    };
    entityConfigMap: {
        [className: string]: IEntityConfig;
    };
    localStoreConfigMap: {
        [storeName: string]: ILocalStoreConfig;
    };
    hasChangeLists: boolean;
    hasDeltaStores: boolean;
    hasLocalStores: boolean;
    offlineDeltaStore: IOfflineDeltaStoreConfig;
    constructor(config: PHPersistenceConfig);
    getEntityConfig(entity: any): IEntityConfig;
    getEntityConfigFromQ<IQE extends IQEntity<IQE>>(qEntity: IQE): IEntityConfig;
    getEntityConfigWithClassNameAndConstructor(className: string, constructor: Function): IEntityConfig;
}
