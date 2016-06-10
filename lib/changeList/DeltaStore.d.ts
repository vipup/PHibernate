/**
 * Created by Papa on 5/27/2016.
 */
import { GoogleSharingAdaptor, PlatformType, SharingAdaptor, SharedChangeList } from "delta-store";
import { IDeltaStoreConfig } from "../config/DeltaStoreConfig";
export interface IDeltaStore {
    changeListMap: {
        [changeListName: string]: SharedChangeList;
    };
    config: IDeltaStoreConfig;
    sharingAdaptor: SharingAdaptor;
    goOffline(): void;
    goOnline(): Promise<any>;
}
export declare class DeltaStore implements IDeltaStore {
    config: IDeltaStoreConfig;
    sharingAdaptor: SharingAdaptor;
    changeListMap: {
        [changeListName: string]: SharedChangeList;
    };
    constructor(config: IDeltaStoreConfig, sharingAdaptor?: SharingAdaptor);
    goOffline(): void;
    goOnline(): Promise<any>;
    setupChangeLists(): Promise<any>;
    private loadChangeLists();
}
export declare function getSharingAdaptor(platformType: PlatformType): SharingAdaptor;
export declare function getGooglesSharingAdaptor(): GoogleSharingAdaptor;
