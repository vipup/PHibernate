import { ChangeRecord } from "delta-store/lib/index";
/**
 * Created by Papa on 6/28/2016.
 */
export interface IRecordStateData {
    accessed: {
        [fieldName: string]: boolean;
    };
    current: {
        [fieldName: string]: any;
    };
    initialized: {
        [fieldName: string]: boolean;
    };
    original: {
        [fieldName: string]: any;
    };
}
export declare class RecordStateData implements IRecordStateData {
    accessed: {
        [fieldName: string]: boolean;
    };
    current: {
        [fieldName: string]: any;
    };
    initialized: {
        [fieldName: string]: boolean;
    };
    original: {
        [fieldName: string]: any;
    };
}
export interface IRecordState {
    data: IRecordStateData;
    initialized: boolean;
    isDirty: boolean;
    proxied: boolean;
    getChangeRecord(): ChangeRecord;
}
export declare class RecordState implements IRecordState {
    data: RecordStateData;
    initialized: boolean;
    isDirty: boolean;
    proxied: boolean;
    getChangeRecord(): ChangeRecord;
}
