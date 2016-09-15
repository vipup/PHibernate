import {EntityChange} from "../model/EntityChange";
/**
 * Created by Papa on 9/15/2016.
 */

export class EntityChangeDao {

	getAllChanges(
		entityName:string
	):EntityChange[] {
		throw `Not implemented`;
	}

	getChangesFromTime(
		entityName:string,
		time:Date
	):EntityChange[] {
		throw `Not implemented`;
	}

	getChangePage(
		entityName:string,
		pageNumber:number,
		pageSize:number
	):EntityChange[] {
		throw `Not implemented`;
	}
}