import { AbstractFieldChange, AbstractFieldChangeApi } from "./AbstractFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class DateFieldChange extends AbstractFieldChange implements AbstractFieldChangeApi<Date> {
    newValue: Date;
    oldValue: Date;
}
