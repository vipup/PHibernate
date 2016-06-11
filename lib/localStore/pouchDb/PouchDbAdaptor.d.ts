import { LocalStoreAdaptor } from "../LocalStoreAdaptor";
import { PouchDbStoreSetupInfo } from "./PouchDbApi";
import { IQEntity } from "querydsl-typescript/lib/index";
/**
 * Created by Papa on 5/28/2016.
 */
export declare class PouchDbAdaptor implements LocalStoreAdaptor {
    localDB: pouchDB.IPouchDB;
    initialize(setupInfo: PouchDbStoreSetupInfo): Promise<any>;
    create<E>(entity: E): Promise<E>;
    delete<E>(entity: E): Promise<E>;
    query<E, IQE extends IQEntity<IQE>>(qEntity: IQE): Promise<E>;
    persist<E>(entity: E): Promise<E>;
    update<E>(entity: E): Promise<E>;
}
