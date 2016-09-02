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
		entityClass:{new (): E},
		entity:E
	):Promise<E>;

	delete<E>(
		entityClass:{new (): E},
		entity:E
	):Promise<E>;

	find<E, IE extends IEntity>(
		entityClass:{new ():E},
		phQuery:PHQuery<IE>
	):Promise<E[]>;

	findOne<E, IE extends IEntity>(
		entityClass:{new ():E},
		phQuery:PHQuery<IE>
	):Promise<E>;

	initialize(
		setupInfo:StoreSetupInfo
	):Promise<any>;

	save<E>(
		entityClass:{new (): E},
		entity:E
	):Promise<E>;

	search<E, IE extends IEntity>(
		entityClass:{new ():E},
		phQuery:PHQuery<IE>,
	  subject?:Subject<E[]>
	):Observable<E[]>;

	searchOne<E, IE extends IEntity>(
		entityClass:{new ():E},
		phQuery:PHQuery<IE>,
		subject?:Subject<E>
	):Observable<E>;

	update<E>(
		entityClass:{new (): E},
		entity:E
	):Promise<E>;

}
