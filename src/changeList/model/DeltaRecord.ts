import {Column, Id, MappedSuperclass} from "querydsl-typescript";
/**
 * Created by Papa on 9/15/2016.
 */

/**
 * Base record for all delta records
 */

@MappedSuperclass()
export abstract class DeltaRecord {

	@Id()
	@Column({name: 'ID'})
	id: string;

	@Column({name: 'CREATE_DEVICE_ID'})
	createDeviceId: string;

	@Column({name: 'CREATE_DATE_TIME'})
	createDateTime: Date;

	@Column({name: 'CREATE_USER_ID'})
	createUserId: string;

	static getDRId<DB extends DeltaRecord>(
		dbRecord: DB,
		indexInMillisecond: number
	) {
		return this.getId(dbRecord.createDeviceId, dbRecord.createDateTime, dbRecord.createUserId, indexInMillisecond);
	}

	static getId(
		createDeviceId: string,
		createDateTime: Date,
		createUserId: string,
		indexInMillisecond: number
	) {
		return `${createDeviceId}_${createDateTime.getTime()}_${indexInMillisecond}_${createUserId}`;
	}

}