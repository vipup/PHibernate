import { LocalStoreSetupInfo, LocalStoreType } from "./LocalStoreApi";
import { IStoreAdaptor } from "../store/StoreAdaptor";
/**
 * Created by Papa on 5/28/2016.
 */
export interface ILocalStoreAdaptor extends IStoreAdaptor {
    type: LocalStoreType;
    initialize(setupInfo: LocalStoreSetupInfo): Promise<any>;
}
