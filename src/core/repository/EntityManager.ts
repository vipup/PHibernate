/**
 * Created by Papa on 5/23/2016.
 */

import {getSharingAdaptor, IDeltaStore, DeltaStore} from "../../changeList/DeltaStore";
import {IPersistenceConfig} from "../../config/PersistenceConfig";
import {getLocalStoreAdaptor} from "../../localStore/LocalStore";
import {LocalStoreAdaptor} from "../../localStore/LocalStoreAdaptor";
import {getOfflineSharingAdaptor} from "../../changeList/OfflineStore";
import {EntityProxy} from "../proxy/Proxies";
import {
	QEntity, IEntity, IEntityQuery, RelationRecord, RelationType, CascadeType,
	PHGraphQuery, PHRawSQLQuery, PHSQLQuery
} from "querydsl-typescript";
import {Observable} from "rxjs/Observable";
import {PH} from "../../config/PH";
import {EntityUtils} from "../../shared/EntityUtils";
import {Subject} from "rxjs/Subject";
import {Transactional} from "../metadata/decorators";
import {ChangeGroup, StubChangeGroup, IChangeGroup} from "../../changeList/model/ChangeGroup";

export interface IEntityManager {

	goOffline(): void;
	goOnline(): Promise<any>;
	initialize(): Promise<any>;
	isOnline(): boolean;

	create<E>(
		entityClass: {new (): E},
		entity: E,
		cascade?: CascadeType
	): Promise<E>;

	delete<E>(
		entityClass: {new (): E},
		entity: E,
		cascade?: CascadeType
	): Promise<E>;

	find<E, IE extends IEntity>(
		entityClass: {new (): E},
		iEntity: IE
	): Promise<E[]>;

	findOne<E, IE extends IEntity>(
		entityClass: {new (): E},
		iEntity: IE
	): Promise<E>;

	initialize(): Promise<any>;

	save<E>(
		entityClass: {new (): E},
		entity: E,
		cascade?: CascadeType
	): Promise<E>;

	search<E, IE extends IEntity>(
		entityClass: {new (): E},
		iEntity: IE,
		subject?: Subject<E[]>
	): Observable<E[]>;

	searchOne<E, IE extends IEntity>(
		entityClass: {new (): E},
		iEntity: IE,
		subject?: Subject<E>
	): Observable<E>;

	update<E>(
		entityClass: {new (): E},
		entity: E,
		cascade?: CascadeType
	): Promise<E>;
}

export class EntityManager implements IEntityManager {

	deltaStoreMap: {[deltaStoreName: string]: IDeltaStore} = {};
	online: boolean;
	offlineDeltaStore: IDeltaStore;
	localStoreMap: {[localStoreTypeName: string]: LocalStoreAdaptor} = {};
	defaultLocalStore: LocalStoreAdaptor;

	constructor(
		public config: IPersistenceConfig
	) {
		if (config.offlineDeltaStore) {
			let offlineSharingAdaptor = getOfflineSharingAdaptor(config.offlineDeltaStore.type);
			this.offlineDeltaStore = new DeltaStore(config.offlineDeltaStore, offlineSharingAdaptor);
		}
		if (config.hasDeltaStores) {
			for (let deltaStoreName in config.deltaStoreConfigMap) {
				let deltaStoreConfig = config.deltaStoreConfigMap[deltaStoreName];
				let sharingAdaptor = getSharingAdaptor(deltaStoreConfig.setupInfo.platformType);
				let deltaStore = new DeltaStore(deltaStoreConfig, sharingAdaptor);
				this.deltaStoreMap[deltaStoreName] = deltaStore;
			}
		}
		if (config.hasLocalStores) {
			for (let localStoreName in config.localStoreConfigMap) {
				if (this.defaultLocalStore) {
					throw `Unsupported Feature: More than one Local Store defined.`;
				}
				let localStoreConfig = config.localStoreConfigMap[localStoreName];
				let localStoreAdaptor = getLocalStoreAdaptor(localStoreConfig.setupInfo.type, localStoreConfig.setupInfo.idGeneration);
				this.localStoreMap[localStoreName] = localStoreAdaptor;
				this.defaultLocalStore = localStoreAdaptor;
			}
		}

	}

	getLocalStore(localStoreTypeName?: string) {
		let localStore: LocalStoreAdaptor;
		if (localStoreTypeName) {
			localStore = this.localStoreMap[localStoreTypeName];
			if (!localStore) {
				throw `LocalStore '${localStoreTypeName}' is not setup.`;
			}
		} else {
			if (!this.defaultLocalStore) {
				throw `Default LocalStore is not setup.`;
			}
			localStore = this.defaultLocalStore;
		}
		return localStore;
	}

	async initialize(): Promise<any> {
		let initializers: Promise<any>[] = [];

		if (this.offlineDeltaStore) {
			initializers.push(this.offlineDeltaStore.goOnline());
		}

		for (let localStoreName in this.localStoreMap) {
			let localStoreConfig = this.config.localStoreConfigMap[localStoreName];
			let localStore = this.localStoreMap[localStoreName];
			initializers.push(localStore.initialize(localStoreConfig.setupInfo));
		}

		return Promise.all(initializers);
	}

	goOffline(): void {
		for (let deltaStoreName in this.deltaStoreMap) {
			let deltaStore = this.deltaStoreMap[deltaStoreName];
			deltaStore.goOffline();
		}
		this.online = false;
	}

	async goOnline(): Promise<any> {
		let initializers: Promise<any>[] = [];

		for (let deltaStoreName in this.deltaStoreMap) {
			let deltaStore = this.deltaStoreMap[deltaStoreName];
			initializers.push(deltaStore.goOnline());
		}

		return Promise.all(initializers).then(results => this.online = true);
	}

	isOnline(): boolean {
		return true;
	}

	async create<E>(
		entityClass: {new (): E},
		entity: E
	): Promise<E> {
		return this.persistEntity(entityClass, entity, 'create');
	}

	async delete<E>(
		entityClass: {new (): E},
		entity: E
	): Promise<E> {
		return this.persistEntity(entityClass, entity, 'delete');
	}

	async save<E>(
		entityClass: {new (): E},
		entity: E
	): Promise<E> {
		return this.persistEntity(entityClass, entity, 'persist');
	}

	async update<E>(
		entityClass: {new (): E},
		entity: E
	): Promise<E> {
		return this.persistEntity(entityClass, entity, 'update');
	}

	@Transactional()
	private async persistEntity<E>(
		entityClass: {new (): E},
		entity: E,
		operation: 'create' | 'delete' | 'persist' | 'update'
	): Promise<E> {
		let entityConfig = this.config.getEntityConfig(entityClass);

		let changeGroup: IChangeGroup;
		let localStore;
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (!localStore) {
				throw `Cound not find Local Store '${entityConfig.localStoreConfig.setupInfo.name}'`;
			}
		} else {}

		let persistedInLocalStore: boolean = false;
		await localStore[operation](entityClass, entity, localStore.activeChangeGroup);
		await localStore['create']('ChangeGroup', localStore.activeChangeGroup, new StubChangeGroup());
		changeGroup = localStore.activeChangeGroup;
		persistedInLocalStore = true;

		let persistedInDeltaStore: boolean = false;
		if (entityConfig.changeListConfig) {
			if (!changeGroup) {
				if (!this.defaultLocalStore) {
					throw `Default local store is not setup`;
				}
				await this.defaultLocalStore[operation](entityClass, entity, this.defaultLocalStore.activeChangeGroup);
				changeGroup = this.defaultLocalStore.activeChangeGroup;
			}
			if (this.isOnline()) {
				let deltaStore = this.deltaStoreMap[entityConfig.changeListConfig.deltaStoreName];
				await deltaStore.addChange(entityConfig, changeGroup);
			} else {
				await this.offlineDeltaStore.addChange(entityConfig, changeGroup);
			}
			persistedInDeltaStore = true;
		}

		if (!persistedInDeltaStore && !persistedInLocalStore) {
			throw `Entity is not persisted in either Delta Store or Local Store`;
		}

		return entity;
	}

	private ensureId<E>(
		entity: E
	) {
	}

	search<E, IE extends IEntity>(
		entityClass: {new (): E},
		phRawQuery: PHRawSQLQuery<IE>,
		subject?: Subject<E[]>
	): Observable<E[]> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let entityConfig = this.config.getEntityConfigFromQ(qEntity);
		let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (localStore) {
				return localStore.search(qEntity.__entityName__, phQuery, subject);
			}
		}
		throw `Entity is not setup with a LocalStore`;
	}

	searchOne<E, IE extends IEntity>(
		entityClass: {new (): E},
		phRawQuery: PHRawSQLQuery<IE>,
		subject?: Subject<E>
	): Observable<E> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let entityConfig = this.config.getEntityConfigFromQ(qEntity);
		let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (localStore) {
				return localStore.searchOne(qEntity.__entityName__, phQuery, subject);
			}
		}
		throw `Entity is not setup with a LocalStore`;
	}

	async find<E, IE extends IEntity>(
		entityClass: {new (): E},
		phRawQuery: PHRawSQLQuery<IE>
	): Promise<E[]> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let entityConfig = this.config.getEntityConfigFromQ(qEntity);
		let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (localStore) {
				return await <any>localStore.find(qEntity.__entityName__, phQuery);
			}
		}
		throw `Entity is not setup with a LocalStore`;
	}

	async findOne<E, IE extends IEntity>(
		entityClass: {new (): E},
		phRawQuery: PHRawSQLQuery<IE>
	): Promise<E> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let entityConfig = this.config.getEntityConfigFromQ(qEntity);
		let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (localStore) {
				return await <any>localStore.findOne(qEntity.__entityName__, phQuery);
			}
		}
		throw `Entity is not setup with a LocalStore`;
	}

	getPHSQLQuery<E, IE extends IEntity>(
		qEntity: any,
		phRawQuery: PHRawSQLQuery<IE>
	): PHSQLQuery<IE> {
		let qEntityMap: {[entityName: string]: QEntity<any>} = PH.qEntityMap;
		let entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}} = PH.entitiesRelationPropertyMap;
		let entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}} = PH.entitiesPropertyTypeMap;
		let phSqlQuery: PHSQLQuery<IE> = new PHSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);

		return phSqlQuery;
	}

}