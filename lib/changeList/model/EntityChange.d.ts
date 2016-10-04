import { IQEntity, IQField, JSONBaseOperation, IOperation } from "querydsl-typescript";
import { BooleanFieldChange } from "./BooleanFieldChange";
import { DateFieldChange } from "./DateFieldChange";
import { NumberFieldChange } from "./NumberFieldChange";
import { StringFieldChange } from "./StringFieldChange";
import { AbstractFieldChange } from "./AbstractFieldChange";
import { AbstractEntityChange, IAbstractEntityChange, StubAbstractEntityChange } from "./AbstractEntityChange";
/**
 * Created by Papa on 9/15/2016.
 */
export interface IEntityChange extends IAbstractEntityChange {
    changedEntityId: string;
    numberOfFieldsInEntity: number;
    booleanFieldChanges: BooleanFieldChange[];
    dateFieldChanges: DateFieldChange[];
    numberFieldChanges: NumberFieldChange[];
    stringFieldChanges: StringFieldChange[];
    addNewFieldChange(fieldName: string, oldValue: any, newValue: any, field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>): AbstractFieldChange;
    addNewBooleanFieldChange(fieldName: string, oldValue: any, newValue: any): BooleanFieldChange;
    addNewDateFieldChange(fieldName: string, oldValue: any, newValue: any): DateFieldChange;
    addNewNumberFieldChange(fieldName: string, oldValue: any, newValue: any): NumberFieldChange;
    addNewStringFieldChange(fieldName: string, oldValue: any, newValue: any): StringFieldChange;
}
export declare class EntityChange extends AbstractEntityChange implements IEntityChange {
    changedEntityId: string;
    numberOfFieldsInEntity: number;
    booleanFieldChanges: BooleanFieldChange[];
    dateFieldChanges: DateFieldChange[];
    numberFieldChanges: NumberFieldChange[];
    stringFieldChanges: StringFieldChange[];
    addNewFieldChange(fieldName: string, oldValue: any, newValue: any, field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>): AbstractFieldChange;
    addNewBooleanFieldChange(fieldName: string, oldValue: boolean, newValue: boolean): BooleanFieldChange;
    addNewDateFieldChange(fieldName: string, oldValue: Date, newValue: Date): DateFieldChange;
    addNewNumberFieldChange(fieldName: string, oldValue: number, newValue: number): NumberFieldChange;
    addNewStringFieldChange(fieldName: string, oldValue: string, newValue: string): StringFieldChange;
    private addNewFieldChangeInternal<C>(fieldName, fieldChange);
}
export declare class StubEntityChange extends StubAbstractEntityChange implements IEntityChange {
    changedEntityId: string;
    numberOfFieldsInEntity: number;
    booleanFieldChanges: BooleanFieldChange[];
    dateFieldChanges: DateFieldChange[];
    numberFieldChanges: NumberFieldChange[];
    stringFieldChanges: StringFieldChange[];
    addNewFieldChange(fieldName: string, oldValue: any, newValue: any, field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>): AbstractFieldChange;
    addNewBooleanFieldChange(fieldName: string, oldValue: boolean, newValue: boolean): BooleanFieldChange;
    addNewDateFieldChange(fieldName: string, oldValue: Date, newValue: Date): DateFieldChange;
    addNewNumberFieldChange(fieldName: string, oldValue: number, newValue: number): NumberFieldChange;
    addNewStringFieldChange(fieldName: string, oldValue: string, newValue: string): StringFieldChange;
}
