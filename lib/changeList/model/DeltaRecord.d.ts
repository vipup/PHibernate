/**
 * Created by Papa on 9/15/2016.
 */
/**
 * Base record for all delta records
 */
export declare abstract class DeltaRecord {
    id: string;
    createDeviceId: string;
    createDateTime: Date;
    createUserId: string;
    static getDRId<DB extends DeltaRecord>(dbRecord: DB, indexInMillisecond: number): string;
    static getId(createDeviceId: string, createDateTime: Date, createUserId: string, indexInMillisecond: number): string;
}
