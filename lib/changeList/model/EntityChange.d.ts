import { ChangeGroup } from "./ChangeGroup";
import { DeltaBackedRecord } from "./DeltaBackedRecord";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class EntityChange extends DeltaBackedRecord {
    entityName: string;
    entityCreateDeviceId: string;
    entityCreateDateTime: Date;
    entityCreateUserId: string;
    changeGroup: ChangeGroup;
}
