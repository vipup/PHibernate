/**
 * Created by Papa on 4/21/2016.
 */
import { IOperation, IQEntity, JSONBaseOperation } from "querydsl-typescript";
import { QueryState } from "../query/QueryState";
export interface IRepository<E, QE extends IQEntity, R extends IRepository<E, QE, R>> {
    selectAll(): R;
    where(...operations: IOperation<any, JSONBaseOperation>[]): R;
    select(...fields: IOperation<any, JSONBaseOperation>[]): R;
    getQ(): QE;
    include<OQE extends IQEntity>(otherQ: OQE): R;
    execute(): Promise<E[]>;
    whereOther<OQE extends IQEntity>(otherQ: OQE): R;
}
export declare abstract class QRepository<E, QE extends IQEntity, R extends IRepository<E, QE, R>> implements IRepository<E, QE, R> {
    currentQueryState: QueryState<QE>;
    abstract getQ(): QE;
    selectAll(): R;
    where(...operations: IOperation<any, JSONBaseOperation>[]): R;
    select(): R;
    whereOther<OQE extends IQEntity>(otherQ: OQE): R;
    include<OQE extends IQEntity>(otherQ: OQE): R;
    getQuery(): QueryState<QE>;
    setQuery(query: QueryState<QE>): void;
    execute(repository?: any): Promise<E[]>;
}
