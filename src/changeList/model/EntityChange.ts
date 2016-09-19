import {CascadeType, Column, Entity, JoinColumn, ManyToOne, OneToMany, Table} from "querydsl-typescript";
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

	addNewBooleanFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): BooleanFieldChange;

	addNewDateFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): DateFieldChange;

	addNewNumberFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): NumberFieldChange;

	addNewStringFieldChange(
		entityChange: EntityChange,
		fieldName: string
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

	addNewBooleanFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): BooleanFieldChange {
		let booleanFieldChange = new BooleanFieldChange();
		let fieldChange = this.addNewFieldChange(entityChange, fieldName, booleanFieldChange);
		entityChange.booleanFieldChanges.push(fieldChange);

		return fieldChange;
	}

	addNewDateFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): DateFieldChange {
		let dateFieldChange = new DateFieldChange();
		let fieldChange = this.addNewFieldChange(entityChange, fieldName, dateFieldChange);
		entityChange.dateFieldChanges.push(fieldChange);

		return fieldChange;
	}

	addNewNumberFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): NumberFieldChange {
		let numberFieldChange = new NumberFieldChange();
		let fieldChange = this.addNewFieldChange(entityChange, fieldName, numberFieldChange);
		entityChange.numberFieldChanges.push(fieldChange);

		return fieldChange;
	}

	addNewStringFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): StringFieldChange {
		let stringFieldChange = new StringFieldChange();
		let fieldChange = this.addNewFieldChange(entityChange, fieldName, stringFieldChange);
		entityChange.stringFieldChanges.push(fieldChange);

		return fieldChange;
	}

	private addNewFieldChange<C extends AbstractFieldChange>(
		entityChange: EntityChange,
		fieldName: string,
		fieldChange: C
	): C {
		fieldChange.createDateTime = entityChange.createDateTime;
		fieldChange.createDeviceId = entityChange.createDeviceId;
		fieldChange.createUserId = entityChange.createUserId;
		fieldChange.entityChange = entityChange;
		fieldChange.fieldIdInEntity = ++entityChange.numberOfFieldsInEntity;
		fieldChange.propertyName = fieldName;
		fieldChange.id = AbstractFieldChange.getFieldChangeId(fieldChange.fieldIdInEntity, entityChange.entityChangeIdInGroup, entityChange.createDeviceId, entityChange.createDateTime, entityChange.createUserId);

		return fieldChange;
	}

}

export class StubEntityChange implements IEntityChange {

	addNewBooleanFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): BooleanFieldChange {
		return new BooleanFieldChange();
	}

	addNewDateFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): DateFieldChange {
		return new DateFieldChange();
	}

	addNewNumberFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): NumberFieldChange {
		return new NumberFieldChange();
	}

	addNewStringFieldChange(
		entityChange: EntityChange,
		fieldName: string
	): StringFieldChange {
		return new StringFieldChange();
	}

}