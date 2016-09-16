/**
 * Created by Papa on 9/15/2016.
 */
/**
 * Base record for all delta based
 */
export declare abstract class DeltaBackedRecord {
    id: string;
    createDeviceId: string;
    createDateTime: Date;
    createUserId: string;
    static getId(createDeviceId: string, createDateTime: Date, createUserId: string): string;
}
