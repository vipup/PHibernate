import {Column, Entity, Table} from "querydsl-typescript";
import {AbstractFieldChange, AbstractFieldChangeApi} from "./AbstractFieldChange";
/**
 * Created by Papa on 9/15/2016.
 */

@Entity()
@Table({name: "NUMBER_FIELD_CHANGE"})
export class NumberFieldChange extends AbstractFieldChange implements AbstractFieldChangeApi<number> {

	@Column({name: "NEW_VALUE"})
	newValue:number;

	@Column({name: "OLD_VALUE"})
	oldValue:number;
}