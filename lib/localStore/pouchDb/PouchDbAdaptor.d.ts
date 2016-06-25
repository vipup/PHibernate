import { LocalStoreAdaptor } from "../LocalStoreAdaptor";
import { PouchDbStoreSetupInfo } from "./PouchDbApi";
import { IQEntity, QEntity } from "querydsl-typescript/lib/index";
import { Observable } from "rxjs/Observable";
/**
 * Created by Papa on 5/28/2016.
 */
export declare class PouchDbAdaptor implements LocalStoreAdaptor {
    localDB: pouchDB.IPouchDB;
    initialize(setupInfo: PouchDbStoreSetupInfo): Promise<any>;
    create<E>(entity: E): Promise<E>;
    delete<E>(entity: E): Promise<E>;
    query<E, IQE extends IQEntity>(iQEntity: IQE, qEntity: QEntity<any>): Observable<E>;
    queryOnce<E, IQE extends IQEntity>(iQEntity: IQE, qEntity: QEntity<any>): Promise<E>;
    save<E>(entity: E): Promise<E>;
    update<E>(entity: E): Promise<E>;
}
