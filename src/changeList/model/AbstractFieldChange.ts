import {EntityChange} from "./EntityChange";
import {Column, JoinColumn, ManyToOne, MappedSuperclass} from "querydsl-typescript";
import {DeltaRecord} from "./DeltaRecord";
/**
 * Created by Papa on 9/15/2016.
 */

@MappedSuperclass()
export abstract class AbstractFieldChange extends DeltaRecord {
	@Column({name: "PROPERTY_NAME"})
	propertyName:string;

	@ManyToOne()
	@JoinColumn({name: "ENTITY_CHANGE_ID", nullable: false})
	entityChange:EntityChange;

	static getFieldChangeId(
		propertyName:string,
		entityIdInGroup:number,
		createDeviceId:string,
		createDateTime:Date,
		createUserId:string
	):string {
		return `${entityIdInGroup}_${createDeviceId}_${createDateTime.getTime()}_${createUserId}_${propertyName}`;
	}

}