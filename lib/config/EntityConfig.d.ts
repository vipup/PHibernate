/**
 * Created by Papa on 5/28/2016.
 */
import { ILocalStoreConfig } from "./LocalStoreConfig";
import { IChangeListConfig } from "./ChangeListConfig";
import { IPersistenceConfig } from "./PersistenceConfig";
export interface PHEntityConfig {
    changeList?: string;
    localStore?: string;
}
export interface IEntityConfig {
    changeListConfig?: IChangeListConfig;
    className?: string;
    clazz?: any;
    localStoreConfig?: ILocalStoreConfig;
}
export declare class EntityConfig implements IEntityConfig {
    className: string;
    clazz: Function;
    private config;
    private persistenceConfig;
    static getObjectClassName(object: any): string;
    static getClassName(clazz: Function): string;
    changeListConfig: IChangeListConfig;
    localStoreConfig: ILocalStoreConfig;
    constructor(className: string, clazz: Function, config: PHEntityConfig, persistenceConfig: IPersistenceConfig);
}
