import {CascadeType, Column, Entity, JoinColumn, ManyToOne, OneToMany, Table} from "querydsl-typescript";
import {ChangeGroup} from "./ChangeGroup";
import {DeltaBackedRecord} from "./DeltaBackedRecord";
import {BooleanFieldChange} from "./BooleanFieldChange";
import {DateFieldChange} from "./DateFieldChange";
import {NumberFieldChange} from "./NumberFieldChange";
import {StringFieldChange} from "./StringFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */

@Entity()
@Table({name: "ENTITY_CHANGE"})
export class EntityChange extends DeltaBackedRecord {

	@Column({name: "ENTITY_NAME"})
	entityName:string;

	@Column({name: 'ENTITY_CREATE_DEVICE_ID'})
	entityCreateDeviceId:string;

	@Column({name: 'ENTITY_ID_IN_GROUP'})
	entityIdInGroup:number;

	@Column({name: "NUM_FIELDS_IN_ENTITY"})
	numberOfFieldsInEntity:number;

	@Column({name: 'ENTITY_CREATE_DATE_TIME'})
	entityCreateDateTime:Date;

	@Column({name: 'ENTITY_CREATE_DEVICE_ID'})
	entityCreateUserId:string;

	@OneToMany({ cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	booleanFieldChanges:BooleanFieldChange[];

	@OneToMany({ cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	dateFieldChanges:DateFieldChange[];

	@OneToMany({ cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	numberFieldChanges:NumberFieldChange[];

	@OneToMany({ cascade: CascadeType.ALL, mappedBy: 'entityChange'})
	stringFieldChanges:StringFieldChange[];

	@ManyToOne()
	@JoinColumn({name: "CHANGE_ID", nullable: false})
	changeGroup:ChangeGroup;

	static getEntityChangeId(
		entityIdInGroup:number,
		createDeviceId:string,
		createDateTime:Date,
		createUserId:string
	):string {
		return `${entityIdInGroup}_${createDeviceId}_${createDateTime.getTime()}_${createUserId}`;
	}

}