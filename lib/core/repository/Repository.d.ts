/// <reference path="../../../typings/tsd.d.ts" />
/**
 * Created by Papa on 4/21/2016.
 */
import "es6-shim";
import { IOperation, IQEntity } from "querydsl-typescript";
import { QueryState } from "../query/QueryState";
export interface IRepository<E, QE extends IQEntity<QE>, R extends IRepository<E, QE, R>> {
    selectAll(): R;
    where(...operations: IOperation<QE>[]): R;
    select(...fields: IOperation<QE>[]): R;
    getQ(): QE;
    include<OQE extends IQEntity<QE>>(otherQ: OQE): R;
    execute(): Promise<E[]>;
    whereOther<OQE extends IQEntity<QE>>(otherQ: OQE): R;
}
export declare abstract class QRepository<E, QE extends IQEntity<QE>, R extends IRepository<E, QE, R>> implements IRepository<E, QE, R> {
    currentQueryState: QueryState<QE>;
    abstract getQ(): QE;
    selectAll(): R;
    where(...operations: IOperation<QE>[]): R;
    select(): R;
    whereOther<OQE extends IQEntity<QE>>(otherQ: OQE): R;
    include<OQE extends IQEntity<QE>>(otherQ: OQE): R;
    getQuery(): QueryState<QE>;
    setQuery(query: QueryState<QE>): void;
    execute(repository?: any): Promise<E[]>;
}
