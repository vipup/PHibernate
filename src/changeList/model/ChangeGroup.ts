import {AbstractChangeRecord} from "./AbstractChangeRecord";
import {Column, Entity, Table} from "querydsl-typescript";
/**
 * Created by Papa on 9/15/2016.
 */

@Entity()
@Table({name: "CHANGE_GROUP"})
export class ChangeGroup extends AbstractChangeRecord {

	@Column({name: "TYPE"})
	type;

}