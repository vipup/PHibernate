import { IQEntity, IQField, JSONBaseOperation, IOperation } from "querydsl-typescript";
import { ChangeGroup } from "./ChangeGroup";
import { BooleanFieldChange } from "./BooleanFieldChange";
import { DateFieldChange } from "./DateFieldChange";
import { NumberFieldChange } from "./NumberFieldChange";
import { StringFieldChange } from "./StringFieldChange";
import { AbstractFieldChange } from "./AbstractFieldChange";
import { DeltaRecord } from "./DeltaRecord";
/**
 * Created by Papa on 9/15/2016.
 */
export declare enum EntityChangeType {
    CREATE = 0,
    DELETE = 1,
    UPDATE = 2,
}
export interface IEntityChange {
    addNewFieldChange(fieldName: string, oldValue: any, newValue: any, field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>): AbstractFieldChange;
    addNewBooleanFieldChange(fieldName: string, oldValue: any, newValue: any): BooleanFieldChange;
    addNewDateFieldChange(fieldName: string, oldValue: any, newValue: any): DateFieldChange;
    addNewNumberFieldChange(fieldName: string, oldValue: any, newValue: any): NumberFieldChange;
    addNewStringFieldChange(fieldName: string, oldValue: any, newValue: any): StringFieldChange;
}
export declare class EntityChange extends DeltaRecord implements IEntityChange {
    entityName: string;
    changeType: EntityChangeType;
    changedEntityId: string;
    entityChangeIdInGroup: number;
    numberOfFieldsInEntity: number;
    booleanFieldChanges: BooleanFieldChange[];
    dateFieldChanges: DateFieldChange[];
    numberFieldChanges: NumberFieldChange[];
    stringFieldChanges: StringFieldChange[];
    changeGroup: ChangeGroup;
    static getEntityChangeId(entityIdInGroup: number, createDeviceId: string, createDateTime: Date, createUserId: string, indexInMillisecond: number): string;
    addNewFieldChange(fieldName: string, oldValue: any, newValue: any, field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>): AbstractFieldChange;
    addNewBooleanFieldChange(fieldName: string, oldValue: boolean, newValue: boolean): BooleanFieldChange;
    addNewDateFieldChange(fieldName: string, oldValue: Date, newValue: Date): DateFieldChange;
    addNewNumberFieldChange(fieldName: string, oldValue: number, newValue: number): NumberFieldChange;
    addNewStringFieldChange(fieldName: string, oldValue: string, newValue: string): StringFieldChange;
    private addNewFieldChangeInternal<C>(fieldName, fieldChange);
}
export declare class StubEntityChange implements IEntityChange {
    addNewFieldChange(fieldName: string, oldValue: any, newValue: any, field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>): AbstractFieldChange;
    addNewBooleanFieldChange(fieldName: string, oldValue: boolean, newValue: boolean): BooleanFieldChange;
    addNewDateFieldChange(fieldName: string, oldValue: Date, newValue: Date): DateFieldChange;
    addNewNumberFieldChange(fieldName: string, oldValue: number, newValue: number): NumberFieldChange;
    addNewStringFieldChange(fieldName: string, oldValue: string, newValue: string): StringFieldChange;
}
