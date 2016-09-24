/**
 * Created by Papa on 5/28/2016.
 */
import { ILocalStoreConfig } from "./LocalStoreConfig";
import { IChangeListConfig } from "./ChangeListConfig";
import { IPersistenceConfig } from "./PersistenceConfig";
import { IRemoteStoreConfig } from "./RemoveStoreConfig";
export interface PHEntityConfig {
    changeList?: string;
    localStore?: string;
}
export interface IEntityConfig {
    changeListConfig?: IChangeListConfig;
    className?: string;
    clazz?: any;
    localStoreConfig?: ILocalStoreConfig;
    remoteStoreConfig?: IRemoteStoreConfig;
}
export declare class EntityConfig implements IEntityConfig {
    className: string;
    clazz: Function;
    private config;
    private persistenceConfig;
    changeListConfig: IChangeListConfig;
    localStoreConfig: ILocalStoreConfig;
    constructor(className: string, clazz: Function, config: PHEntityConfig, persistenceConfig: IPersistenceConfig);
}
