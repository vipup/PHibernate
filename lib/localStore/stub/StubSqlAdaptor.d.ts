import { SqlAdaptor, CascadeRecord } from "../SqlAdaptor";
import { ChangeGroupApi } from "../../changeList/model/ChangeGroup";
import { SQLDialect, QEntity, PHQuery, IEntity, SQLStringDelete, SQLStringUpdate } from "querydsl-typescript";
import { EntityChangeApi } from "../../changeList/model/EntityChange";
import { Subject, Observable } from "rxjs";
import { ILocalStoreAdaptor } from "../LocalStoreAdaptor";
import { LocalStoreSetupInfo } from "../LocalStoreApi";
import { EntityWhereChangeApi } from "../../changeList/model/EntityWhereChange";
/**
 * Created by Papa on 9/20/2016.
 */
export declare class StubSqlAdaptor extends SqlAdaptor implements ILocalStoreAdaptor {
    private currentTransaction;
    initialize(setupInfo: LocalStoreSetupInfo): Promise<any>;
    wrapInTransaction(callback: () => Promise<any>): Promise<any>;
    protected getDialect(): SQLDialect;
    protected findNative(sqlQuery: string, parameters: any[]): Promise<any[]>;
    protected createNative(qEntity: QEntity<any>, columnNames: string[], values: any[], cascadeRecords: CascadeRecord[], changeGroup: ChangeGroupApi): Promise<void>;
    protected deleteNative(qEntity: QEntity<any>, entity: any, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: ChangeGroupApi): Promise<EntityChangeApi>;
    protected deleteWhereNative<IE extends IEntity>(sqlStringDelete: SQLStringDelete<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    protected insertNative(qEntity: QEntity<any>, columnNames: string[], values: any[]): Promise<void>;
    protected updateNative(qEntity: QEntity<any>, columnNames: string[], values: any[], idProperty: string, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: ChangeGroupApi): Promise<void>;
    protected updateWhereNative<IE extends IEntity>(sqlStringUpdate: SQLStringUpdate<IE>, changeGroup: ChangeGroupApi): Promise<EntityWhereChangeApi>;
    search<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    warn(message: string): void;
}
