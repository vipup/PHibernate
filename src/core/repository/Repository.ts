/**
 * Created by Papa on 4/21/2016.
 */

import {IOperation, IQEntity} from "querydsl-typescript";
import {QueryState} from "../query/QueryState";

export interface IRepository<E, QE extends IQEntity, R extends IRepository<E, QE, R>> {

	selectAll():R;

	where( //
		...operations:IOperation<QE>[] //
	):R;

	select(
		...fields:IOperation<QE>[] //
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

export abstract class Repository<E, QE extends IQEntity, R extends IRepository<E, QE, R>>
implements IRepository<E, QE, R> {

	currentQueryState:QueryState<QE>;

	abstract getQ():QE;

	selectAll():R {
		this.currentQueryState = new QueryState<QE>();
		this.currentQueryState.setAll();

		return <any>this;
	}

	by( //
		...operations:IOperation<QE>[] //
	):R {
		let q = this.getQ();
		q.and.apply(q, operations);
		this.currentQueryState.setBy(q);

		return <any>this;
	}

	find():R {
		this.currentQueryState = new QueryState<QE>();
		this.currentQueryState.setFind();

		return <any>this;
	}

	byOther<OQE extends IQEntity>( //
		otherQ:OQE //
	):R {
		this.currentQueryState.addByOther(otherQ);

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

	retrieve( //
		repository?:any //
	):Promise<E[]> {
		// this.currentQueryState.setRetrieve(repository);

		return null;
	};
}
s