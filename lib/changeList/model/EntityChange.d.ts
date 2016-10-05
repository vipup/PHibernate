import { IQEntity, IQField, JSONBaseOperation, IOperation } from "querydsl-typescript";
import { BooleanFieldChange } from "./BooleanFieldChange";
import { DateFieldChange } from "./DateFieldChange";
import { NumberFieldChange } from "./NumberFieldChange";
import { StringFieldChange } from "./StringFieldChange";
import { AbstractFieldChange } from "./AbstractFieldChange";
import { AbstractEntityChange, AbstractEntityChangeApi, StubAbstractEntityChange } from "./AbstractEntityChange";
/**
 * Created by Papa on 9/15/2016.
 */
export interface EntityChangeApi extends AbstractEntityChangeApi {
    changedEntityId: string;
    numberOfFieldsInEntity: number;
    booleanFieldChanges: BooleanFieldChange[];
    dateFieldChanges: DateFieldChange[];
    numberFieldChanges: NumberFieldChange[];
    stringFieldChanges: StringFieldChange[];
    addNewFieldChange(fieldName: string, entityRelationName: string, oldValue: any, newValue: any, field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>): AbstractFieldChange;
    addNewBooleanFieldChange(fieldName: string, entityRelationName: string, oldValue: any, newValue: any): BooleanFieldChange;
    addNewDateFieldChange(fieldName: string, entityRelationName: string, oldValue: any, newValue: any): DateFieldChange;
    addNewNumberFieldChange(fieldName: string, entityRelationName: string, oldValue: any, newValue: any): NumberFieldChange;
    addNewStringFieldChange(fieldName: string, entityRelationName: string, oldValue: any, newValue: any): StringFieldChange;
}
export declare class EntityChange extends AbstractEntityChange implements EntityChangeApi {
    changedEntityId: string;
    numberOfFieldsInEntity: number;
    booleanFieldChanges: BooleanFieldChange[];
    dateFieldChanges: DateFieldChange[];
    numberFieldChanges: NumberFieldChange[];
    stringFieldChanges: StringFieldChange[];
    addNewFieldChange(fieldName: string, entityRelationName: string, oldValue: any, newValue: any, field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>): AbstractFieldChange;
    addNewBooleanFieldChange(fieldName: string, entityRelationName: string, oldValue: boolean, newValue: boolean): BooleanFieldChange;
    addNewDateFieldChange(fieldName: string, entityRelationName: string, oldValue: Date, newValue: Date): DateFieldChange;
    addNewNumberFieldChange(fieldName: string, entityRelationName: string, oldValue: number, newValue: number): NumberFieldChange;
    addNewStringFieldChange(fieldName: string, entityRelationName: string, oldValue: string, newValue: string): StringFieldChange;
    private addNewFieldChangeInternal<C>(fieldName, entityRelationName, fieldChange);
}
export declare class StubEntityChange extends StubAbstractEntityChange implements EntityChangeApi {
    changedEntityId: string;
    numberOfFieldsInEntity: number;
    booleanFieldChanges: BooleanFieldChange[];
    dateFieldChanges: DateFieldChange[];
    numberFieldChanges: NumberFieldChange[];
    stringFieldChanges: StringFieldChange[];
    addNewFieldChange(fieldName: string, entityRelationName: string, oldValue: any, newValue: any, field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>): AbstractFieldChange;
    addNewBooleanFieldChange(fieldName: string, entityRelationName: string, oldValue: boolean, newValue: boolean): BooleanFieldChange;
    addNewDateFieldChange(fieldName: string, entityRelationName: string, oldValue: Date, newValue: Date): DateFieldChange;
    addNewNumberFieldChange(fieldName: string, entityRelationName: string, oldValue: number, newValue: number): NumberFieldChange;
    addNewStringFieldChange(fieldName: string, entityRelationName: string, oldValue: string, newValue: string): StringFieldChange;
}
