/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "querydsl-typescript";

export class QueryState<QE extends IQEntity<QE>> {
	hasAll:boolean = false;
	hasFind:boolean = false;
	hasRetrieve:boolean = false;
	theBy:QE;
	byOthers:IQEntity<QE>[] = [];
	includes:IQEntity<QE>[] = [];

	setSelectAll():void {
		let errorPrefix = 'Cannot specify "selectAll()": ';
		this.validateByOrAllSetup(errorPrefix);
		this.hasAll = true;
	}

	setWhere( //
		entity:QE //
	):void {
		let errorPrefix = 'Cannot specify "where(q)": ';
		this.validateByOrAllSetup(errorPrefix);
		this.theBy = entity;
	}

	setSelect():void {
		let errorPrefix = 'Cannot specify "select()": ';
		if (this.hasFind) {
			throw errorPrefix + `find() is already specified`;
		}
		this.hasFind = true;
	}

	addWhereOther<OQE extends IQEntity<QE>>( //
		otherQ:OQE //
	):void {
		let errorPrefix = 'Cannot specify "otherBy(qO)": ';
		this.validateByOrAllPresent(errorPrefix);
		this.byOthers.push(otherQ);
	}

	addInclude<OQE extends IQEntity<QE>>(
		otherQ:OQE //
	):void {
		let errorPrefix = 'Cannot specify "include(qO)": ';
		this.validateByOrAllPresent(errorPrefix);
		this.includes.push(otherQ);
	}

	setRetrieve( //
		repository?:any //
	):void {
		let errorPrefix = 'Cannot specify "execute()": ';
		if (this.hasRetrieve) {
			throw errorPrefix + ` "retrieve()" IS already specified`;
		}
		this.validateByOrAllPresent(errorPrefix);
		this.hasRetrieve = true;

		return null;
	};

	equals( //
		otherState:QueryState<QE>, //
		checkValues:boolean = true //
	):boolean {
		if (this.hasAll) {
			if (!otherState.hasAll) {
				return false;
			}
		} else if (otherState.hasAll) {
			return false;
		}
		if (this.hasFind) {
			if (!otherState.hasFind) {
				return false;
			}
		} else if (otherState.hasFind) {
			return false;
		}
		if (this.hasRetrieve) {
			if (!otherState.hasRetrieve) {
				return false;
			}
		} else if (otherState.hasRetrieve) {
			return false;
		}

		if (this.theBy) {
			if (!otherState.theBy) {
				return false;
			}
		} else if (otherState.theBy) {
			return false;
		}
		if (!this.theBy.objectEquals(otherState.theBy, checkValues)) {
			return false;
		}

		if (this.byOthers.length != otherState.byOthers.length) {
			return false;
		}
		for (let i = 0; i < this.byOthers.length; i++) {
			let myByOther = this.byOthers[i];
			let otherByOther = otherState.byOthers[i];
			if (!myByOther.objectEquals(otherByOther, checkValues)) {
				return false;
			}
		}

		if (this.includes.length != otherState.includes.length) {
			return false;
		}
		for (let i = 0; i < this.includes.length; i++) {
			let myInclude = this.includes[i];
			let otherInclude = otherState.includes[i];
			if (!myInclude.objectEquals(otherInclude, checkValues)) {
				return false;
			}
		}

		return true;
	}

	private validateByOrAllSetup( //
		errorPrefix:string //
	):void {
		if (!this.hasFind) {
			throw errorPrefix + `find() is NOT specified`;
		}
		if (this.theBy) {
			throw errorPrefix + `by(q) IS already specified`;
		}
		if (this.hasAll) {
			throw errorPrefix + `all() IS already specified`;
		}
		if (this.byOthers) {
			throw errorPrefix + `byOther(otherQ) IS already specified`;
		}
	}

	private validateByOrAllPresent( //
		errorPrefix:string //
	):void {
		if (!this.theBy) {
			throw errorPrefix + `by(q) is NOT specified`;
		}
		if (!this.hasAll) {
			throw errorPrefix + `all() is NOT specified`;
		}
	}
}
