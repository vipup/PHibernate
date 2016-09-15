import {ChangeGroup} from "../model/ChangeGroup";
/**
 * Created by Papa on 9/15/2016.
 */

export class ChangeGroupDao {

	getAllChangeGroups(
		groupName:string
	):ChangeGroup[] {
		throw `Not implemented`;
	}

	getChangeGroupsFromTime(
		groupName:string,
		time:Date
	):ChangeGroup[] {
		throw `Not implemented`;
	}

	getChangeGroupPage(
		groupName:string,
		pageNumber:number,
		pageSize:number
	):ChangeGroup[] {
		throw `Not implemented`;
	}

}