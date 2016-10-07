import { AbstractFieldChange, AbstractFieldChangeApi } from "./AbstractFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */
export declare class StringFieldChange extends AbstractFieldChange implements AbstractFieldChangeApi<string> {
    newValue: string;
    oldValue: string;
}
