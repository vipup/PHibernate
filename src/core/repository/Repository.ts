/**
 * Created by Papa on 4/21/2016.
 */
import {IOperation, IQEntity} from "querydsl-typescript";
import {QueryState} from "../query/QueryState";

export interface IRepository<E, QE extends IQEntity, R extends IRepository<E, QE, R>> {

	selectAll():R;

	where( //
		...operations:IOperation[] //
	):R;

	select(
		...fields:IOperation[] //
	):R;

	getQ():QE;

	include<OQE extends IQEntity>( //
		otherQ:OQE //
	):R;

	execute():Promise<E[]>;

	whereOther<OQE extends IQEntity>( //
		otherQ:OQE //
	):R;
}

export abstract class QRepository<E, QE extends IQEntity, R extends IRepository<E, QE, R>>
implements IRepository<E, QE, R> {

	currentQueryState:QueryState<QE>;

	abstract getQ():QE;

	selectAll():R {
		this.currentQueryState = new QueryState<QE>();
		this.currentQueryState.setSelectAll();

		return <any>this;
	}

	where( //
		...operations:IOperation[] //
	):R {
		let q = this.getQ();
		// q.and.apply(q, operations);
		this.currentQueryState.setWhere(q);

		return <any>this;
	}

	select():R {
		this.currentQueryState = new QueryState<QE>();
		this.currentQueryState.setSelect();

		return <any>this;
	}

	whereOther<OQE extends IQEntity>( //
		otherQ:OQE //
	):R {
		this.currentQueryState.addWhereOther(otherQ);

		return <any>this;
	}

	include<OQE extends IQEntity>( //
		otherQ:OQE //
	):R {
		this.currentQueryState.addInclude(otherQ);
		return <any>this;
	}

	getQuery():QueryState<QE> {
		return this.currentQueryState;
	}

	setQuery( //
		query:QueryState<QE> //
	):void {
		this.currentQueryState = query;
	}

	execute( //
		repository?:any //
	):Promise<E[]> {
		// this.currentQueryState.setRetrieve(repository);

		return null;
	};
}