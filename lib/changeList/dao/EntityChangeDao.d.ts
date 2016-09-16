import { EntityChange } from "../model/EntityChange";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class EntityChangeDao {
    getAllChanges(entityName: string): EntityChange[];
    getChangesFromTime(entityName: string, time: Date): EntityChange[];
    getChangePage(entityName: string, pageNumber: number, pageSize: number): EntityChange[];
}
