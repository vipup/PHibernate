import {
	Column, Entity,
	Table
} from "querydsl-typescript";
import {
	IAbstractEntityChange, AbstractEntityChange,
	StubAbstractEntityChange
} from "./AbstractEntityChange";
/**
 * Created by Papa on 9/15/2016.
 */

export interface IEntityWhereChange extends IAbstractEntityChange {

	queryJson: string;

}

@Entity()
@Table({name: "ENTITY_WHERE_CHANGE"})
export class EntityWhereChange extends AbstractEntityChange implements IEntityWhereChange {

	@Column({name: "QUERY_JSON"})
	queryJson: string;

}

export class StubWhereEntityChange extends StubAbstractEntityChange implements IEntityWhereChange {

	queryJson: string;

}