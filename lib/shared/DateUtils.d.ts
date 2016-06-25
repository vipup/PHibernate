import { Task } from "../core/metadata/decorators";
import { IQueryOperation } from "querydsl-typescript/lib/index";
import { Observable } from "rxjs/Observable";
/**
 * Created by Papa on 6/11/2016.
 */
export declare function like(like: string | RegExp): IQueryOperation;
export declare function greaterThan(greaterThan: number): IQueryOperation;
export declare class DateUtils {
    static getNowTimeStamp(): string;
    iQuery(test: any): any;
    test: Observable<Task>;
}
