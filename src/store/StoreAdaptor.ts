import {IEntity, PHQuery} from "querydsl-typescript";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

/**
 * Created by Papa on 6/10/2016.
 */

export interface StoreSetupInfo {
	name:string;
}

export interface StoreAdaptor {

	wrapInTransaction(callback: ()=>void);

	create<E>(
		entityName:string,
		entity:E
	):Promise<E>;

	delete<E>(
		entityName:string,
		entity:E
	):Promise<E>;

	find<E, IE extends IEntity>(
		entityName:string,
		phQuery:PHQuery<IE>
	):Promise<E[]>;

	findOne<E, IE extends IEntity>(
		entityName:string,
		phQuery:PHQuery<IE>
	):Promise<E>;

	initialize(
		setupInfo:StoreSetupInfo
	):Promise<any>;

	save<E>(
		entityName:string,
		entity:E
	):Promise<E>;

	search<E, IE extends IEntity>(
		entityName:string,
		phQuery:PHQuery<IE>,
	  subject?:Subject<E[]>
	):Observable<E[]>;

	searchOne<E, IE extends IEntity>(
		entityName:string,
		phQuery:PHQuery<IE>,
		subject?:Subject<E>
	):Observable<E>;

	update<E>(
		entityName:string,
		entity:E
	):Promise<E>;

}
