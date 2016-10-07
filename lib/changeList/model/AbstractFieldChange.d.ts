import { EntityChange } from "./EntityChange";
import { DeltaRecord, DeltaRecordApi } from "./DeltaRecord";
/**
 * Created by Papa on 9/15/2016.
 */
export interface AbstractFieldChangeApi<P> extends DeltaRecordApi {
    newValue: P;
    oldValue: P;
    entityRelationName: string;
    propertyName: string;
    entityChange: EntityChange;
}
export declare abstract class AbstractFieldChange extends DeltaRecord {
    entityRelationName: string;
    propertyName: string;
    entityChange: EntityChange;
    static getFieldChangeId(propertyName: string, entityIdInGroup: number, createDeviceId: string, createDateTime: Date, createUserId: string): string;
}
