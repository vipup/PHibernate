import { EntityChange } from "./EntityChange";
import { DeltaBackedRecord } from "./DeltaBackedRecord";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class ChangeGroup extends DeltaBackedRecord {
    type: any;
    entityChanges: EntityChange[];
}
