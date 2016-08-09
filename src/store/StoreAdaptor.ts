import {PHQuery} from "querydsl-typescript";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

/**
 * Created by Papa on 6/10/2016.
 */

export interface StoreSetupInfo {
	name:string;
}

export interface StoreAdaptor {

	create<E>(
		entity:E
	):Promise<E>;

	delete<E>(
		entity:E
	):Promise<E>;

	find<E>(
		entityClass:{new ():E},
		phQuery:PHQuery
	):Promise<E[]>;

	findOne<E>(
		entityClass:{new ():E},
		phQuery:PHQuery
	):Promise<E>;

	initialize(
		setupInfo:StoreSetupInfo
	):Promise<any>;

	save<E>(
		entity:E
	):Promise<E>;

	search<E>(
		entityClass:{new ():E},
		phQuery:PHQuery,
	  subject?:Subject<E[]>
	):Observable<E[]>;

	searchOne<E>(
		entityClass:{new ():E},
		phQuery:PHQuery,
		subject?:Subject<E>
	):Observable<E>;

	update<E>(
		entity:E
	):Promise<E>;

}
