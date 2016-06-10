import { SharingAdaptor } from "delta-store";
import { LocalStoreType } from "../localStore/LocalStoreApi";
export declare function getOfflineSharingAdaptor(localStoreType: LocalStoreType): SharingAdaptor;
export declare function getOfflinePouchdbSharingAdaptor(): SharingAdaptor;
