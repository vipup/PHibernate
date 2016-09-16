import {EntityChange} from "./EntityChange";
import {Column, JoinColumn, ManyToOne} from "querydsl-typescript";
import {DeltaBackedRecord} from "./DeltaBackedRecord";
/**
 * Created by Papa on 9/15/2016.
 */

export class AbstractFieldChange extends DeltaBackedRecord {

	@Column({name: "FIELD_NAME"})
	fieldName:string;

	@ManyToOne()
	@JoinColumn({name: "ENTITY_CHANGE_ID", nullable: false})
	entityChange:EntityChange;

}