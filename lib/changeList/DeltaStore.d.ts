/**
 * Created by Papa on 5/27/2016.
 */
import { GoogleSharingAdaptor, PlatformType, SharingAdaptor, SharedChangeList, ChangeRecord } from "delta-store";
import { IDeltaStoreConfig } from "../config/DeltaStoreConfig";
import { IChangeListConfig } from "../config/ChangeListConfig";
export interface IDeltaStore {
    config: IDeltaStoreConfig;
    sharingAdaptor: SharingAdaptor;
    addChange<E>(changeListConfig: IChangeListConfig, changeRecord: E): Promise<E>;
    getChangeList(changeListConfig: IChangeListConfig): SharedChangeList;
    getChangeListName(changeListConfig: IChangeListConfig): string;
    goOffline(): void;
    goOnline(): Promise<any>;
}
export declare class DeltaStore implements IDeltaStore {
    config: IDeltaStoreConfig;
    sharingAdaptor: SharingAdaptor;
    batchChanges: boolean;
    protected changeListMap: {
        [changeListName: string]: SharedChangeList;
    };
    protected batchedChangeMap: {
        [changeListName: string]: ChangeRecord[];
    };
    constructor(config: IDeltaStoreConfig, sharingAdaptor?: SharingAdaptor);
    addChange<E>(changeListConfig: IChangeListConfig, changeRecord: E): Promise<E>;
    getChangeListName(changeListConfig: IChangeListConfig): string;
    getChangeList(changeListConfig: IChangeListConfig): SharedChangeList;
    goOffline(): void;
    goOnline(): Promise<any>;
    private setupChangeLists();
    private loadChangeLists();
}
export declare function getSharingAdaptor(platformType: PlatformType): SharingAdaptor;
export declare function getGooglesSharingAdaptor(): GoogleSharingAdaptor;
