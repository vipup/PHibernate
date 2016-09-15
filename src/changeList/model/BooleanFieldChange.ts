import {Column, Entity, Table} from "querydsl-typescript";
import {AbstractFieldChange} from "./AbstractFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */

@Entity()
@Table({name: "BOOLEAN_FIELD_CHANGE"})
export class BooleanFieldChange extends AbstractFieldChange {

	@Column({name: "NEW_VALUE"})
	newValue:boolean;

	@Column({name: "OLD_VALUE"})
	oldValue:boolean;
}