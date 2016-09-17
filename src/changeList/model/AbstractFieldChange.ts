import {EntityChange} from "./EntityChange";
import {Column, JoinColumn, ManyToOne} from "querydsl-typescript";
import {DeltaBackedRecord} from "./DeltaBackedRecord";
/**
 * Created by Papa on 9/15/2016.
 */

export abstract class AbstractFieldChange extends DeltaBackedRecord {
	@Column({name: "FIELD_NAME"})
	fieldName:string;

	@ManyToOne()
	@JoinColumn({name: "ENTITY_CHANGE_ID", nullable: false})
	entityChange:EntityChange;

	@Column({name: 'ENTITY_ID_IN_GROUP'})
	entityIdInGroup:number;

	@Column({name: "FIELD_ID_IN_ENTITY"})
	fieldIdInEntity:number;

	static getFieldChangeId(
		fieldIdInEntity:number,
		entityIdInGroup:number,
		createDeviceId:string,
		createDateTime:Date,
		createUserId:string
	):string {
		return `${fieldIdInEntity}_${entityIdInGroup}_${createDeviceId}_${createDateTime.getTime()}_${createUserId}`;
	}

}