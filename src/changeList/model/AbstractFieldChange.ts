import {EntityChange} from "./EntityChange";
import {Column, JoinColumn, ManyToOne, MappedSuperclass} from "querydsl-typescript";
import {DeltaRecord, DeltaRecordApi, StubDeltaRecord} from "./DeltaRecord";
/**
 * Created by Papa on 9/15/2016.
 */

export interface AbstractFieldChangeApi<P> extends DeltaRecordApi {
	newValue:P;
	oldValue:P;
	entityRelationName: string;
	propertyName: string;
	entityChange: EntityChange;
}

@MappedSuperclass()
export abstract class AbstractFieldChange extends DeltaRecord {
	@Column({name: "ENTITY_RELATION_NAME"})
	entityRelationName: string;

	@Column({name: "PROPERTY_NAME"})
	propertyName: string;

	@ManyToOne()
	@JoinColumn({name: "ENTITY_CHANGE_ID", nullable: false})
	entityChange: EntityChange;

	static getFieldChangeId(
		propertyName: string,
		entityIdInGroup: number,
		createDeviceId: string,
		createDateTime: Date,
		createUserId: string
	): string {
		return `${entityIdInGroup}_${createDeviceId}_${createDateTime.getTime()}_${createUserId}_${propertyName}`;
	}

}