import { ChangeGroup } from "./ChangeGroup";
import { DeltaBackedRecord } from "./DeltaBackedRecord";
import { BooleanFieldChange } from "./BooleanFieldChange";
import { DateFieldChange } from "./DateFieldChange";
import { NumberFieldChange } from "./NumberFieldChange";
import { StringFieldChange } from "./StringFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class EntityChange extends DeltaBackedRecord {
    entityName: string;
    entityCreateDeviceId: string;
    entityCreateDateTime: Date;
    entityCreateUserId: string;
    booleanFieldChanges: BooleanFieldChange[];
    dateFieldChanges: DateFieldChange[];
    numberFieldChanges: NumberFieldChange[];
    stringFieldChanges: StringFieldChange[];
    changeGroup: ChangeGroup;
}
