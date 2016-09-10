import { LocalStore, LocalStoreShareInfo, LocalStoreSetupInfo, LocalStoreType } from "../LocalStoreApi";
import { IdGeneration } from "../IdGenerator";
/**
 * Created by Papa on 5/28/2016.
 */
export declare class PouchDbStoreShareInfo implements LocalStoreShareInfo {
    name: string;
}
export declare class PouchDbStoreSetupInfo implements LocalStoreSetupInfo {
    name: string;
    type: LocalStoreType;
    idGeneration: IdGeneration;
}
export declare class PouchDbStore implements LocalStore {
    insert(entity: any): Promise<any>;
    delete(entity: any): Promise<any>;
    update(entity: any): Promise<any>;
    query(query: any): Promise<any>;
}
