import { Subject } from "rxjs";
import { FieldMap } from "querydsl-typescript";
/**
 * Created by Papa on 9/10/2016.
 */
export declare class Query {
    subject: Subject<any>;
    fieldMap: FieldMap;
}
export declare class ChangeToQueryRegistry {
    activeQueries: Query[];
    addQuery(subject: Subject<any>, fieldMap: FieldMap): void;
    removeQuery(subject: Subject<any>): void;
    findAffectedQueries(changeRecords: any[]): Query[];
}
