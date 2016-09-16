import { EntityChange } from "./EntityChange";
import { DeltaBackedRecord } from "./DeltaBackedRecord";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class AbstractFieldChange extends DeltaBackedRecord {
    fieldName: string;
    entityChange: EntityChange;
}
