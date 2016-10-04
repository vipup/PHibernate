/**
 * Created by Papa on 9/15/2016.
 */
/**
 * Base record for all delta records
 */
export interface DeltaRecordApi {
    id: string;
    createDateTime: Date;
    createDeviceId: string;
    createUserId: string;
}
export declare abstract class DeltaRecord {
    static getDRId<DB extends DeltaRecord>(dbRecord: DB, indexInMillisecond: number): string;
    static getId(createDeviceId: string, createDateTime: Date, createUserId: string, indexInMillisecond: number): string;
    id: string;
    createDeviceId: string;
    createDateTime: Date;
    createUserId: string;
}
