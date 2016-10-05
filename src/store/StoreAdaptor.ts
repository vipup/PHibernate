import {IEntity, PHQuery} from "querydsl-typescript";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ChangeGroupApi} from "../changeList/model/ChangeGroup";
import {PHDelete, PHUpdate} from "querydsl-typescript/lib/query/PHQuery";
import {EntityWhereChangeApi} from "../changeList/model/EntityWhereChange";
import {EntityChangeApi} from "../changeList/model/EntityChange";

/**
 * Created by Papa on 6/10/2016.
 */

export interface StoreSetupInfo {
	name: string;
}

export interface IStoreAdaptor {

	activeChangeGroup: ChangeGroupApi;

	wrapInTransaction(callback: ()=>void);

	insert<E>(
		entityName: string,
		entity: E,
		changeGroup: ChangeGroupApi
	): Promise<EntityChangeApi>;

	create<E>(
		entityName: string,
		entity: E,
		changeGroup: ChangeGroupApi
	): Promise<EntityChangeApi>;

	delete<E>(
		entityName: string,
		entity: E,
		changeGroup: ChangeGroupApi
	): Promise<EntityChangeApi>;

	deleteWhere<IE extends IEntity>(
		entityName: string,
		phDelete: PHDelete<IE>,
		changeGroup: ChangeGroupApi
	): Promise<EntityWhereChangeApi>;

	find<E, IE extends IEntity>(
		entityName: string,
		phQuery: PHQuery<IE>
	): Promise<E[]>;

	findOne<E, IE extends IEntity>(
		entityName: string,
		phQuery: PHQuery<IE>
	): Promise<E>;

	initialize(
		setupInfo: StoreSetupInfo
	): Promise<any>;

	save<E>(
		entityName: string,
		entity: E,
		changeGroup: ChangeGroupApi
	): Promise<EntityChangeApi>;

	search<E, IE extends IEntity>(
		entityName: string,
		phQuery: PHQuery<IE>,
		subject?: Subject<E[]>
	): Observable<E[]>;

	searchOne<E, IE extends IEntity>(
		entityName: string,
		phQuery: PHQuery<IE>,
		subject?: Subject<E>
	): Observable<E>;

	update<E>(
		entityName: string,
		entity: E,
		changeGroup: ChangeGroupApi
	): Promise<EntityChangeApi>;

	updateWhere<IE extends IEntity>(
		entityName: string,
		phUpdate: PHUpdate<IE>,
		changeGroup: ChangeGroupApi
	): Promise<EntityWhereChangeApi>;

}
