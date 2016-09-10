import { LocalStoreType } from "./LocalStoreApi";
import { LocalStoreAdaptor } from "./LocalStoreAdaptor";
import { IdGeneration } from "./IdGenerator";
export declare function getLocalStoreAdaptor(localStoreType: LocalStoreType, idGeneration: IdGeneration): LocalStoreAdaptor;
export declare function getSQLiteAdaptor(idGeneration: IdGeneration): LocalStoreAdaptor;
