/**
 * Created by Papa on 5/28/2016.
 */
export interface LocalStoreShareInfo {
    name: string;
}
export interface LocalStoreSetupInfo {
    name: string;
    type: LocalStoreType;
}
export declare enum LocalStoreType {
    POUCH_DB = 0,
}
export declare namespace localStore.type {
    const POUCH_DB: string;
    function getName(localStoreType: LocalStoreType): string;
    function getValue(localStoreTypeName: string): LocalStoreType;
}
export interface LocalStore {
    insert(entity: any): Promise<any>;
    delete(entity: any): Promise<any>;
    update(entity: any): Promise<any>;
    query(query: any): Promise<any>;
}
