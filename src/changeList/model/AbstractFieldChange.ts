import {EntityChange} from "./EntityChange";
import {Column, JoinColumn, ManyToOne} from "querydsl-typescript";
import {AbstractChangeRecord} from "./AbstractChangeRecord";
/**
 * Created by Papa on 9/15/2016.
 */

export class AbstractFieldChange extends AbstractChangeRecord {

	@Column({name: "FIELD_NAME"})
	fieldName:string;

	@ManyToOne()
	@JoinColumn({name: "CHANGE_ID", nullable: false})
	entityChange:EntityChange;

}