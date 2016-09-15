/**
 * Created by Papa on 9/15/2016.
 */

import {Column, Id} from "querydsl-typescript";

export class AbstractChangeRecord {

	@Column({name: "CHANGE_ID"})
	@Id()
	changeId;

	@Column({name: "CHANGE_TIME"})
	changeTime;

}