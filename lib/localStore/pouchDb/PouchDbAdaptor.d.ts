import { LocalStoreAdaptor } from "../LocalStoreAdaptor";
import { PouchDbStore, PouchDbStoreSetupInfo, PouchDbStoreShareInfo } from "./PouchDbApi";
/**
 * Created by Papa on 5/28/2016.
 */
export declare class PouchDbAdaptor implements LocalStoreAdaptor {
    initialize(setupInfo: PouchDbStoreSetupInfo): Promise<any>;
    findExistingStores(setupInfo: PouchDbStoreSetupInfo): Promise<PouchDbStoreShareInfo[]>;
    createStore(name: string, setupInfo: PouchDbStoreSetupInfo): Promise<PouchDbStore>;
    loadStore(shareInfo: PouchDbStoreShareInfo): Promise<PouchDbStore>;
}
