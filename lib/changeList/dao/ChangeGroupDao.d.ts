import { ChangeGroup } from "../model/ChangeGroup";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class ChangeGroupDao {
    getAllChangeGroups(groupName: string): ChangeGroup[];
    getChangeGroupsFromTime(groupName: string, time: Date): ChangeGroup[];
    getChangeGroupPage(groupName: string, pageNumber: number, pageSize: number): ChangeGroup[];
}
