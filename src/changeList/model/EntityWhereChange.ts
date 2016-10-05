import {
	Column, Entity,
	Table
} from "querydsl-typescript";
import {
	AbstractEntityChangeApi, AbstractEntityChange,
	StubAbstractEntityChange
} from "./AbstractEntityChange";
/**
 * Created by Papa on 9/15/2016.
 */

export interface EntityWhereChangeApi extends AbstractEntityChangeApi {

	numberOfAffectedRecords:number;
	queryJson: string;

}

@Entity()
@Table({name: "ENTITY_WHERE_CHANGE"})
export class EntityWhereChange extends AbstractEntityChange implements EntityWhereChangeApi {

	@Column({name: "NUM_AFFECTED_RECORDS"})
	numberOfAffectedRecords:number;

	@Column({name: "QUERY_JSON"})
	queryJson: string;

}

export class StubWhereEntityChange extends StubAbstractEntityChange implements EntityWhereChangeApi {

	numberOfAffectedRecords:number;
	queryJson: string;

}