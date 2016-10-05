import {
	CascadeType, Column, Entity, IQEntity, IQField, JSONBaseOperation,
	IOperation, OneToMany, QBooleanField, QDateField, QNumberField, QStringField,
	Table
} from "querydsl-typescript";
import {BooleanFieldChange} from "./BooleanFieldChange";
import {DateFieldChange} from "./DateFieldChange";
import {NumberFieldChange} from "./NumberFieldChange";
import {StringFieldChange} from "./StringFieldChange";
import {AbstractFieldChange} from "./AbstractFieldChange";
import {
	AbstractEntityChange, AbstractEntityChangeApi,
	StubAbstractEntityChange
} from "./AbstractEntityChange";
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

	addNewFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: any,
		newValue: any,
		field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>
	): AbstractFieldChange;

	addNewBooleanFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: any,
		newValue: any
	): BooleanFieldChange;

	addNewDateFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: any,
		newValue: any
	): DateFieldChange;

	addNewNumberFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: any,
		newValue: any
	): NumberFieldChange;

	addNewStringFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: any,
		newValue: any
	): StringFieldChange;

}

@Entity()
@Table({name: "ENTITY_CHANGE"})
export class EntityChange extends AbstractEntityChange implements EntityChangeApi {

	@Column({name: "CHANGED_ENTITY_ID"})
	changedEntityId: string;

	@Column({name: "NUM_FIELDS_IN_ENTITY"})
	numberOfFieldsInEntity: number = 0;

	@OneToMany({cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	booleanFieldChanges: BooleanFieldChange[] = [];

	@OneToMany({cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	dateFieldChanges: DateFieldChange[] = [];

	@OneToMany({cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	numberFieldChanges: NumberFieldChange[] = [];

	@OneToMany({cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	stringFieldChanges: StringFieldChange[] = [];

	addNewFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: any,
		newValue: any,
		field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>
	): AbstractFieldChange {
		if (field instanceof QBooleanField) {
			return this.addNewBooleanFieldChange(fieldName, entityRelationName, oldValue, newValue);
		} else if (field instanceof QDateField) {
			return this.addNewDateFieldChange(fieldName, entityRelationName, oldValue, newValue);
		} else if (field instanceof QNumberField) {
			return this.addNewNumberFieldChange(fieldName, entityRelationName, oldValue, newValue);
		} else if (field instanceof QStringField) {
			return this.addNewStringFieldChange(fieldName, entityRelationName, oldValue, newValue);
		}
	}

	addNewBooleanFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: boolean,
		newValue: boolean
	): BooleanFieldChange {
		let booleanFieldChange = new BooleanFieldChange();
		let fieldChange = this.addNewFieldChangeInternal(fieldName, entityRelationName, booleanFieldChange);
		fieldChange.oldValue = oldValue;
		fieldChange.newValue = newValue;
		this.booleanFieldChanges.push(fieldChange);

		return fieldChange;
	}

	addNewDateFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: Date,
		newValue: Date
	): DateFieldChange {
		let dateFieldChange = new DateFieldChange();
		let fieldChange = this.addNewFieldChangeInternal(fieldName, entityRelationName, dateFieldChange);
		fieldChange.oldValue = oldValue;
		fieldChange.newValue = newValue;
		this.dateFieldChanges.push(fieldChange);

		return fieldChange;
	}

	addNewNumberFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: number,
		newValue: number
	): NumberFieldChange {
		let numberFieldChange = new NumberFieldChange();
		let fieldChange = this.addNewFieldChangeInternal(fieldName, entityRelationName, numberFieldChange);
		fieldChange.oldValue = oldValue;
		fieldChange.newValue = newValue;
		this.numberFieldChanges.push(fieldChange);

		return fieldChange;
	}

	addNewStringFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: string,
		newValue: string
	): StringFieldChange {
		let stringFieldChange = new StringFieldChange();
		let fieldChange = this.addNewFieldChangeInternal(fieldName, entityRelationName, stringFieldChange);
		fieldChange.oldValue = oldValue;
		fieldChange.newValue = newValue;
		this.stringFieldChanges.push(fieldChange);

		return fieldChange;
	}

	private addNewFieldChangeInternal<C extends AbstractFieldChange>(
		fieldName: string,
		entityRelationName: string,
		fieldChange: C
	): C {
		fieldChange.entityRelationName = entityRelationName;
		fieldChange.createDateTime = this.createDateTime;
		fieldChange.createDeviceId = this.createDeviceId;
		fieldChange.createUserId = this.createUserId;
		fieldChange.entityChange = this;
		++this.numberOfFieldsInEntity;
		fieldChange.propertyName = fieldName;
		fieldChange.id = AbstractFieldChange.getFieldChangeId(fieldName, this.entityChangeIdInGroup, this.createDeviceId, this.createDateTime, this.createUserId);

		return fieldChange;
	}

}

export class StubEntityChange extends StubAbstractEntityChange implements EntityChangeApi {

	changedEntityId: string;
	numberOfFieldsInEntity: number;
	booleanFieldChanges: BooleanFieldChange[];
	dateFieldChanges: DateFieldChange[];
	numberFieldChanges: NumberFieldChange[];
	stringFieldChanges: StringFieldChange[];

	addNewFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: any,
		newValue: any,
		field: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>
	): AbstractFieldChange {
		if (field instanceof QBooleanField) {
			return this.addNewBooleanFieldChange(fieldName, entityRelationName, oldValue, newValue);
		} else if (field instanceof QDateField) {
			return this.addNewDateFieldChange(fieldName, entityRelationName, oldValue, newValue);
		} else if (field instanceof QNumberField) {
			return this.addNewNumberFieldChange(fieldName, entityRelationName, oldValue, newValue);
		} else if (field instanceof QStringField) {
			return this.addNewStringFieldChange(fieldName, entityRelationName, oldValue, newValue);
		}
	}

	addNewBooleanFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: boolean,
		newValue: boolean
	): BooleanFieldChange {
		return new BooleanFieldChange();
	}

	addNewDateFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: Date,
		newValue: Date
	): DateFieldChange {
		return new DateFieldChange();
	}

	addNewNumberFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: number,
		newValue: number
	): NumberFieldChange {
		return new NumberFieldChange();
	}

	addNewStringFieldChange(
		fieldName: string,
		entityRelationName: string,
		oldValue: string,
		newValue: string
	): StringFieldChange {
		return new StringFieldChange();
	}

}