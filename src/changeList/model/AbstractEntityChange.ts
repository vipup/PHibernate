import {DeltaRecord} from "./DeltaRecord";
import {MappedSuperclass, Column, JoinColumn, ManyToOne} from "querydsl-typescript";
import {ChangeGroup} from "./ChangeGroup";
/**
 * Created by Papa on 10/4/2016.
 */

export enum EntityChangeType {
	CREATE,
	DELETE,
	DELETE_WHERE,
	UPDATE,
	UPDATE_WHERE
}

export interface IAbstractEntityChange {
	entityName: string;
	changeType: EntityChangeType;
	entityChangeIdInGroup: number;
	changeGroup: ChangeGroup;
}

@MappedSuperclass()
export class AbstractEntityChange extends DeltaRecord{

	static getEntityChangeId(
		entityIdInGroup: number,
		createDeviceId: string,
		createDateTime: Date,
		createUserId: string,
		indexInMillisecond: number
	): string {
		return `${entityIdInGroup}_${createDeviceId}_${createDateTime.getTime()}_${indexInMillisecond}_${createUserId}`;
	}

	@Column({name: "ENTITY_NAME"})
	entityName: string;

	@Column({name: "CHANGE_TYPE"})
	changeType: EntityChangeType;

	@Column({name: "ENTITY_CHANGE_ID_IN_GROUP"})
	entityChangeIdInGroup: number;

	@ManyToOne()
	@JoinColumn({name: "CHANGE_GROUP_ID", nullable: false})
	changeGroup: ChangeGroup;

}

export class StubAbstractEntityChange implements IAbstractEntityChange {
	entityName: string;
	changeType: EntityChangeType;
	entityChangeIdInGroup: number;
	changeGroup: ChangeGroup;
}