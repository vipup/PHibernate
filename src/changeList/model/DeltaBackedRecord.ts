import {Column, Id} from "querydsl-typescript";
/**
 * Created by Papa on 9/15/2016.
 */

/**
 * Base record for all delta based
 */
export abstract class DeltaBackedRecord {

	@Id()
	@Column({name: 'ID'})
	id:string;

	@Column({name: 'CREATE_DEVICE_ID'})
	createDeviceId:string;


	@Column({name: 'CREATE_DATE_TIME'})
	createDateTime:Date;

	@Column({name: 'CREATE_DEVICE_ID'})
	createUserId:string;

	static getId(
		createDeviceId:string,
		createDateTime:Date,
		createUserId:string
	) {
		return `${createDeviceId}_${createDateTime.getTime()}_${createUserId}`;
	}

}