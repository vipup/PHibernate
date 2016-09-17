import {CascadeType, Column, Entity, OneToMany, Table} from "querydsl-typescript";
import {EntityChange} from "./EntityChange";
import {DeltaBackedRecord} from "./DeltaBackedRecord";
/**
 * Created by Papa on 9/15/2016.
 */

@Entity()
@Table({name: "CHANGE_GROUP"})
export class ChangeGroup extends DeltaBackedRecord {

	@Column({name: "TYPE"})
	type;

	@OneToMany({ cascade: CascadeType.ALL, mappedBy: 'changeGroup'})
	entityChanges:EntityChange[];

	@Column({name: "NUM_ENTITIES_IN_GROUP"})
	numberOfEntitiesInGroup:number;
}