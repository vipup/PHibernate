import { AbstractFieldChange, AbstractFieldChangeApi } from "./AbstractFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class BooleanFieldChange extends AbstractFieldChange implements AbstractFieldChangeApi<boolean> {
    newValue: boolean;
    oldValue: boolean;
}
