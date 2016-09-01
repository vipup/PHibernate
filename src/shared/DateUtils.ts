/**
 * Created by Papa on 6/11/2016.
 */

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

/*
	@Query<ITask, any>(Task, (q, strVal, numVal) => ({
			description: q.strOp.like(strVal),
			taskId: q.numOp.greaterThan(numVal)
		}), this.iQuery)
	test:Observable<Task>;
*/

	//

}