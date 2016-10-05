import { ILocalStoreAdaptor } from "./LocalStoreAdaptor";
import { IEntity, PHQuery } from "querydsl-typescript";
import { Subject, Observable } from "rxjs";
import { LocalStoreSetupInfo, LocalStoreType } from "./LocalStoreApi";
import { ChangeGroupApi } from "../changeList/model/ChangeGroup";
import { PHDelete, PHUpdate } from "querydsl-typescript/lib/query/PHQuery";
import { EntityWhereChangeApi } from "../changeList/model/EntityWhereChange";
import { EntityChangeApi } from "../changeList/model/EntityChange";
/**
 * Created by Papa on 8/31/2016.
 */
export declare abstract class KnexSqlAdaptor implements ILocalStoreAdaptor {
    activeChangeGroup: ChangeGroupApi;
    type: LocalStoreType;
    abstract initialize(setupInfo: LocalStoreSetupInfo): Promise<any>;
    wrapInTransaction(callback: () => void): void;
    insert<E>(entityName: string, entity: E): Promise<EntityChangeApi>;
    create<E>(entityName: string, entity: E): Promise<EntityChangeApi>;
    delete<E>(entityName: string, entity: E): Promise<EntityChangeApi>;
    deleteWhere<IE extends IEntity>(entityName: string, phDelete: PHDelete<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    find<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>): Promise<E[]>;
    findOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>): Promise<E>;
    save<E>(entity: E): Promise<EntityChangeApi>;
    search<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityString: string, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    update<E>(entity: E): Promise<EntityChangeApi>;
    updateWhere<IE extends IEntity>(entityName: string, phUpdate: PHUpdate<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
}
