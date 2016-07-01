import {Query, Task, ITask} from "../core/metadata/decorators";
import {IQueryOperation, QueryOperation, OperationType} from "querydsl-typescript/lib/index";
import {Observable} from "rxjs/Observable";
/**
 * Created by Papa on 6/11/2016.
 */

export function like(
	like:string | RegExp
):IQueryOperation {
	
	let instance = QueryOperation.getDefinedInstance(OperationType.LIKE, like);

	return <QueryOperation>instance;
}

export function greaterThan(
	greaterThan:number
):IQueryOperation {

	let instance = QueryOperation.getDefinedInstance(OperationType.GREATER_THAN, greaterThan);

	return <QueryOperation>instance;
}

export class DateUtils {

	static getNowTimeStamp():string {
		return new Date().toJSON();
	}

	iQuery(
		test:any
	):any {
		let em = null;
		let params = null;
/*
		em.query<ITask>(Task, {

		});
		em.queryOnce<ITask>(Task, {})
		*/
	}


	@Query<ITask, any>(Task, (q, strVal, numVal) => ({
			description: q.strOp.like(strVal),
			taskId: q.numOp.greaterThan(numVal)
		}), this.iQuery)
	test:Observable<Task>;

	//

}