import { QEntity, IEntity } from "querydsl-typescript/lib/index";
import { Observable } from "rxjs/Observable";
/**
 * Created by Papa on 6/10/2016.
 */
export interface StoreSetupInfo {
    name: string;
}
export interface StoreAdaptor {
    initialize(setupInfo: StoreSetupInfo): Promise<any>;
    create<E>(entity: E): Promise<E>;
    delete<E>(entity: E): Promise<E>;
    query<E, IE extends IEntity>(iQEntity: IE, qEntity: QEntity<any>): Observable<E>;
    queryOnce<E, IE extends IEntity>(iQEntity: IE, qEntity: QEntity<any>): Promise<E>;
    save<E>(entity: E): Promise<E>;
    update<E>(entity: E): Promise<E>;
}
