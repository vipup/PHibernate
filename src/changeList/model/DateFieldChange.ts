import {Column, Entity, Table} from "querydsl-typescript";
import {AbstractFieldChange} from "./AbstractFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */

@Entity()
@Table({name: "DATE_FIELD_CHANGE"})
export class DateFieldChange extends AbstractFieldChange {

	@Column({name: "NEW_VALUE"})
	newValue:Date;

	@Column({name: "OLD_VALUE"})
	oldValue:Date;
}