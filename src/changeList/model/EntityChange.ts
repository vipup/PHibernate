import {Column, Entity, JoinColumn, ManyToOne, Table} from "querydsl-typescript";
import {ChangeGroup} from "./ChangeGroup";
/**
 * Created by Papa on 9/15/2016.
 */

@Entity()
@Table({name: "BOOLEAN_FIELD_CHANGE"})
export class EntityChange {

	@Column({name: "ENTITY_NAME"})
	entityName:string;


	@ManyToOne()
	@JoinColumn({name: "CHANGE_ID", nullable: false})
	changeGroup:ChangeGroup;

}