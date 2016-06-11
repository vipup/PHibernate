import { LocalStoreSetupInfo } from "./LocalStoreApi";
import { StoreAdaptor } from "../store/StoreAdaptor";
/**
 * Created by Papa on 5/28/2016.
 */
export interface LocalStoreAdaptor extends StoreAdaptor {
    initialize(setupInfo: LocalStoreSetupInfo): Promise<any>;
}
