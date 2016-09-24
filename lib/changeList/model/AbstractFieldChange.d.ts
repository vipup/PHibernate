import { EntityChange } from "./EntityChange";
import { DeltaRecord } from "./DeltaRecord";
/**
 * Created by Papa on 9/15/2016.
 */
export declare abstract class AbstractFieldChange extends DeltaRecord {
    propertyName: string;
    entityChange: EntityChange;
    static getFieldChangeId(propertyName: string, entityIdInGroup: number, createDeviceId: string, createDateTime: Date, createUserId: string): string;
}
