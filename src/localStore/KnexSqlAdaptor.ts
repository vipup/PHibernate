import {LocalStoreAdaptor} from "./LocalStoreAdaptor";
import {IEntity, PHQuery} from "querydsl-typescript";
import {Subject, Observable} from "rxjs";
import {LocalStoreSetupInfo} from "./LocalStoreApi";
/**
 * Created by Papa on 8/31/2016.
 */

export abstract class KnexSqlAdaptor implements LocalStoreAdaptor {

	abstract initialize(
		setupInfo: LocalStoreSetupInfo
	): Promise<any>;

	create<E>(
		entity: E
	): Promise<E> {
		return null;
	}

	delete<E>(
		entity: E
	): Promise<E> {
		return null;
	}

	find<E, IE extends IEntity>(
		entityClass: {new (): E},
		phQuery: PHQuery<IE>
	): Promise<E[]> {
		return null;
	}

	findOne<E, IE extends IEntity>(
		entityClass: {new (): E},
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
		entityClass: {new (): E},
		phQuery: PHQuery<IE>,
		subject?: Subject<E[]>
	): Observable<E[]> {
		return null;
	}

	searchOne<E, IE extends IEntity>(
		entityClass: {new (): E},
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
}