import {CascadeType, Column, Entity, IQEntity, IQField, JoinColumn, JSONBaseOperation, ManyToOne,
	IOperation, OneToMany, QBooleanField, QDateField, QNumberField, QStringField,
	Table} from "querydsl-typescript";
import {ChangeGroup} from "./ChangeGroup";
import {BooleanFieldChange} from "./BooleanFieldChange";
import {DateFieldChange} from "./DateFieldChange";
import {NumberFieldChange} from "./NumberFieldChange";
import {StringFieldChange} from "./StringFieldChange";
import {AbstractFieldChange} from "./AbstractFieldChange";
import {DeltaRecord} from "./DeltaRecord";
/**
 * Created by Papa on 9/15/2016.
 */

export enum EntityChangeType {
	CREATE,
	DELETE,
	UPDATE
}

export interface IEntityChange {

	addNewFieldChange(
		fieldName: string,
		oldValue:any,
		newValue:any,
		field:IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>
	):AbstractFieldChange;

	addNewBooleanFieldChange(
		fieldName: string,
		oldValue:any,
		newValue:any
	): BooleanFieldChange;

	addNewDateFieldChange(
		fieldName: string,
		oldValue:any,
		newValue:any
	): DateFieldChange;

	addNewNumberFieldChange(
		fieldName: string,
		oldValue:any,
		newValue:any
	): NumberFieldChange;

	addNewStringFieldChange(
		fieldName: string,
		oldValue:any,
		newValue:any
	): StringFieldChange;

}

@Entity()
@Table({name: "ENTITY_CHANGE"})
export class EntityChange extends DeltaRecord implements IEntityChange {

	@Column({name: "ENTITY_NAME"})
	entityName:string;

	@Column({name: 'CHANGE_TYPE'})
	changeType:EntityChangeType;

	@Column({name: 'CHANGED_ENTITY_ID'})
	changedEntityId:string;

	@Column({name: 'ENTITY_CHANGE_ID_IN_GROUP'})
	entityChangeIdInGroup:number;

	@Column({name: "NUM_FIELDS_IN_ENTITY"})
	numberOfFieldsInEntity:number = 0;

	@OneToMany({ cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	booleanFieldChanges:BooleanFieldChange[] = [];

	@OneToMany({ cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	dateFieldChanges:DateFieldChange[] = [];

	@OneToMany({ cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	numberFieldChanges:NumberFieldChange[] = [];

	@OneToMany({ cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	stringFieldChanges:StringFieldChange[] = [];

	@ManyToOne()
	@JoinColumn({name: "CHANGE_ID", nullable: false})
	changeGroup:ChangeGroup;

	static getEntityChangeId(
		entityIdInGroup:number,
		createDeviceId:string,
		createDateTime:Date,
		createUserId:string,
		indexInMillisecond:number
	):string {
		return `${entityIdInGroup}_${createDeviceId}_${createDateTime.getTime()}_${indexInMillisecond}_${createUserId}`;
	}

	addNewFieldChange(
		fieldName: string,
		oldValue:any,
		newValue:any,
		field:IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>
	):AbstractFieldChange {
		if (field instanceof QBooleanField) {
			return this.addNewBooleanFieldChange(fieldName, oldValue, newValue);
		} else if (field instanceof QDateField) {
			return this.addNewDateFieldChange(fieldName, oldValue, newValue);
		} else if (field instanceof QNumberField) {
			return this.addNewNumberFieldChange(fieldName, oldValue, newValue);
		} else if (field instanceof QStringField) {
			return this.addNewStringFieldChange(fieldName, oldValue, newValue);
		}
	}

	addNewBooleanFieldChange(
		fieldName: string,
		oldValue:boolean,
		newValue:boolean
	): BooleanFieldChange {
		let booleanFieldChange = new BooleanFieldChange();
		let fieldChange = this.addNewFieldChangeInternal(fieldName, booleanFieldChange);
		fieldChange.oldValue = oldValue;
		fieldChange.newValue = newValue;
		this.booleanFieldChanges.push(fieldChange);

		return fieldChange;
	}

	addNewDateFieldChange(
		fieldName: string,
		oldValue:Date,
		newValue:Date
	): DateFieldChange {
		let dateFieldChange = new DateFieldChange();
		let fieldChange = this.addNewFieldChangeInternal(fieldName, dateFieldChange);
		fieldChange.oldValue = oldValue;
		fieldChange.newValue = newValue;
		this.dateFieldChanges.push(fieldChange);

		return fieldChange;
	}

	addNewNumberFieldChange(
		fieldName: string,
		oldValue:number,
		newValue:number
	): NumberFieldChange {
		let numberFieldChange = new NumberFieldChange();
		let fieldChange = this.addNewFieldChangeInternal(fieldName, numberFieldChange);
		fieldChange.oldValue = oldValue;
		fieldChange.newValue = newValue;
		this.numberFieldChanges.push(fieldChange);

		return fieldChange;
	}

	addNewStringFieldChange(
		fieldName: string,
		oldValue:string,
		newValue:string
	): StringFieldChange {
		let stringFieldChange = new StringFieldChange();
		let fieldChange = this.addNewFieldChangeInternal(fieldName, stringFieldChange);
		fieldChange.oldValue = oldValue;
		fieldChange.newValue = newValue;
		this.stringFieldChanges.push(fieldChange);

		return fieldChange;
	}

	private addNewFieldChangeInternal<C extends AbstractFieldChange>(
		fieldName: string,
		fieldChange: C
	): C {
		fieldChange.createDateTime = this.createDateTime;
		fieldChange.createDeviceId = this.createDeviceId;
		fieldChange.createUserId = this.createUserId;
		fieldChange.entityChange = this;
		fieldChange.fieldIdInEntity = ++this.numberOfFieldsInEntity;
		fieldChange.propertyName = fieldName;
		fieldChange.id = AbstractFieldChange.getFieldChangeId(fieldChange.fieldIdInEntity, this.entityChangeIdInGroup, this.createDeviceId, this.createDateTime, this.createUserId);

		return fieldChange;
	}

}

export class StubEntityChange implements IEntityChange {

	addNewFieldChange(
		fieldName: string,
		oldValue:any,
		newValue:any,
		field:IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>
	):AbstractFieldChange {
		if (field instanceof QBooleanField) {
			return this.addNewBooleanFieldChange(fieldName, oldValue, newValue);
		} else if (field instanceof QDateField) {
			return this.addNewDateFieldChange(fieldName, oldValue, newValue);
		} else if (field instanceof QNumberField) {
			return this.addNewNumberFieldChange(fieldName, oldValue, newValue);
		} else if (field instanceof QStringField) {
			return this.addNewStringFieldChange(fieldName, oldValue, newValue);
		}
	}

	addNewBooleanFieldChange(
		fieldName: string,
		oldValue:boolean,
		newValue:boolean
	): BooleanFieldChange {
		return new BooleanFieldChange();
	}

	addNewDateFieldChange(
		fieldName: string,
		oldValue:Date,
		newValue:Date
	): DateFieldChange {
		return new DateFieldChange();
	}

	addNewNumberFieldChange(
		fieldName: string,
		oldValue:number,
		newValue:number
	): NumberFieldChange {
		return new NumberFieldChange();
	}

	addNewStringFieldChange(
		fieldName: string,
		oldValue:string,
		newValue:string
	): StringFieldChange {
		return new StringFieldChange();
	}

}