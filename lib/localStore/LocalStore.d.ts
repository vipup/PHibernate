import { LocalStoreType } from "./LocalStoreApi";
import { LocalStoreAdaptor } from "./LocalStoreAdaptor";
export declare function getLocalStoreAdaptor(localStoreType: LocalStoreType): LocalStoreAdaptor;
export declare function getPouchDbAdaptor(): LocalStoreAdaptor;
