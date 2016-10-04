import {ILocalStoreAdaptor} from "./LocalStoreAdaptor";
import {IEntity, PHQuery} from "querydsl-typescript";
import {Subject, Observable} from "rxjs";
import {LocalStoreSetupInfo, LocalStoreType} from "./LocalStoreApi";
import {ChangeGroupApi} from "../changeList/model/ChangeGroup";
import {PHDelete, PHUpdate} from "querydsl-typescript/lib/query/PHQuery";
/**
 * Created by Papa on 8/31/2016.
 */

export abstract class KnexSqlAdaptor implements ILocalStoreAdaptor {

	activeChangeGroup:ChangeGroupApi;
	type:LocalStoreType;

	abstract initialize(
		setupInfo: LocalStoreSetupInfo
	): Promise<any>;

	wrapInTransaction(callback: ()=>void) {
	}

	create<E>(
		entityName: string,
		entity: E
	): Promise<E> {
		return null;
	}

	delete<E>(
		entityName: string,
		entity: E
	): Promise<E> {
		return null;
	}

	deleteWhere<IE extends IEntity>(
		entityName: string,
		phDelete: PHDelete<IE>,
		changeGroup: ChangeGroupApi
	): Promise<void> {
			return null;
	}

	find<E, IE extends IEntity>(
		entityName: string,
		phQuery: PHQuery<IE>
	): Promise<E[]> {
		return null;
	}

	findOne<E, IE extends IEntity>(
		entityName: string,
		phQuery: PHQuery<IE>
	): Promise<E> {
		return null;

	}

	save<E>(
		entity: E
	): Promise<E> {
		return null;
	}

	search<E, IE extends IEntity>(
		entityName: string,
		phQuery: PHQuery<IE>,
		subject?: Subject<E[]>
	): Observable<E[]> {
		return null;
	}

	searchOne<E, IE extends IEntity>(
		entityString: string,
		phQuery: PHQuery<IE>,
		subject?: Subject<E>
	): Observable<E> {
		return null;
	}

	update<E>(
		entity: E
	): Promise<E> {
		return null;
	}

	updateWhere<IE extends IEntity>(
		entityName: string,
		phUpdate: PHUpdate<IE>,
		changeGroup: ChangeGroupApi
	): Promise<void> {
			return null;
	}
}