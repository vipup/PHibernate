import { SqlAdaptor, CascadeRecord } from "../SqlAdaptor";
import { IChangeGroup } from "../../changeList/model/ChangeGroup";
import { SQLDialect, QEntity, PHQuery, IEntity } from "querydsl-typescript";
import { IEntityChange } from "../../changeList/model/EntityChange";
import { Subject, Observable } from "rxjs";
import { ILocalStoreAdaptor } from "../LocalStoreAdaptor";
import { LocalStoreSetupInfo } from "../LocalStoreApi";
/**
 * Created by Papa on 9/20/2016.
 */
export declare class StubSqlAdaptor extends SqlAdaptor implements ILocalStoreAdaptor {
    private currentTransaction;
    initialize(setupInfo: LocalStoreSetupInfo): Promise<any>;
    wrapInTransaction(callback: () => Promise<any>): Promise<any>;
    protected getDialect(): SQLDialect;
    protected findNative(sqlQuery: string, parameters: any[]): Promise<any[]>;
    protected createNative(qEntity: QEntity<any>, columnNames: string[], values: any[], cascadeRecords: CascadeRecord[], changeGroup: IChangeGroup): Promise<void>;
    protected deleteNative(qEntity: QEntity<any>, entity: any, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: IChangeGroup): Promise<IEntityChange>;
    protected updateNative(qEntity: QEntity<any>, columnNames: string[], values: any[], idProperty: string, idValue: number | string, cascadeRecords: CascadeRecord[], changeGroup: IChangeGroup): Promise<void>;
    search<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E[]>): Observable<E[]>;
    searchOne<E, IE extends IEntity>(entityName: string, phQuery: PHQuery<IE>, subject?: Subject<E>): Observable<E>;
    warn(message: string): void;
}
