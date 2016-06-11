import { IQEntity } from "querydsl-typescript/lib/index";
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
    query<E, IQE extends IQEntity<IQE>>(qEntity: IQE): Promise<E>;
    persist<E>(entity: E): Promise<E>;
    update<E>(entity: E): Promise<E>;
}
