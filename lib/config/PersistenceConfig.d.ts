/**
 * Created by Papa on 5/28/2016.
 */
import { IEntityConfig, PHEntityConfig } from "./EntityConfig";
import { ILocalStoreConfig, PHLocalStoreConfig } from "./LocalStoreConfig";
import { IChangeListConfig, PHChangeListConfig, PHOfflineDeltaStoreConfig, IOfflineDeltaStoreConfig } from "./ChangeListConfig";
import { PHDeltaStoreConfig, IDeltaStoreConfig } from "./DeltaStoreConfig";
import { IQEntity } from "querydsl-typescript";
import { DistributionStrategy, PlatformType } from "delta-store/lib/index";
import { LocalStoreType } from "../localStore/LocalStoreApi";
import { IdGeneration } from "../localStore/IdGenerator";
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
    getEntityConfig(entityClass: {
        new (): any;
    }): IEntityConfig;
    getEntityConfigFromQ<IQE extends IQEntity>(qEntity: IQE): IEntityConfig;
}
export declare class PersistenceConfig implements IPersistenceConfig {
    private config;
    static getDefaultPHConfig(appName?: string, distributionStrategy?: DistributionStrategy, deltaStorePlatform?: PlatformType, deltaIdField?: string, localStoreType?: LocalStoreType, offlineDeltaStoreType?: LocalStoreType, idGeneration?: IdGeneration): PHPersistenceConfig;
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
    getEntityConfig(entityClass: {
        new (): any;
    }): IEntityConfig;
    getEntityConfigFromQ<IQE extends IQEntity>(qEntity: IQE): IEntityConfig;
    getEntityConfigWithClassNameAndConstructor(className: string, constructor: Function): IEntityConfig;
}
