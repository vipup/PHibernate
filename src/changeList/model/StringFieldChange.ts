import {Column, Entity, Table} from "querydsl-typescript";
import {AbstractFieldChange} from "./AbstractFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */

@Entity()
@Table({name: "STRING_FIELD_CHANGE"})
export class StringFieldChange extends AbstractFieldChange {

	@Column({name: "NEW_VALUE"})
	newValue:string;

	@Column({name: "OLD_VALUE"})
	oldValue:string;
}