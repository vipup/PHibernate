import {Column, Entity, JoinColumn, ManyToOne, Table} from "querydsl-typescript";
import {ChangeGroup} from "./ChangeGroup";
import {DeltaBackedRecord} from "./DeltaBackedRecord";
/**
 * Created by Papa on 9/15/2016.
 */

@Entity()
@Table({name: "BOOLEAN_FIELD_CHANGE"})
export class EntityChange extends DeltaBackedRecord {

	@Column({name: "ENTITY_NAME"})
	entityName:string;

	@Column({name: 'ENTITY_CREATE_DEVICE_ID'})
	entityCreateDeviceId:string;


	@Column({name: 'ENTITY_CREATE_DATE_TIME'})
	entityCreateDateTime:Date;

	@Column({name: 'ENTITY_CREATE_DEVICE_ID'})
	entityCreateUserId:string;


	@ManyToOne()
	@JoinColumn({name: "CHANGE_ID", nullable: false})
	changeGroup:ChangeGroup;

}