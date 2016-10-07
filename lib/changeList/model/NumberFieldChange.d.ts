import { AbstractFieldChange, AbstractFieldChangeApi } from "./AbstractFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class NumberFieldChange extends AbstractFieldChange implements AbstractFieldChangeApi<number> {
    newValue: number;
    oldValue: number;
}
