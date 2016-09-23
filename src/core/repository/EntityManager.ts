/**
 * Created by Papa on 5/23/2016.
 */

import {
	getSharingAdaptor, IDeltaStore, DeltaStore, OfflineDeltaStore,
	IOfflineDeltaStore
} from "../../changeList/DeltaStore";
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

	goOffline():void;
	goOnline():Promise<any>;
	initialize():Promise<any>;
	isOnline():boolean;

	create<E>(
		entityClass:{new ():E},
		entity:E,
		cascade?:CascadeType
	):Promise<E>;

	delete<E>(
		entityClass:{new ():E},
		entity:E,
		cascade?:CascadeType
	):Promise<E>;

	find<E, IE extends IEntity>(
		entityClass:{new ():E},
		iEntity:IE
	):Promise<E[]>;

	findOne<E, IE extends IEntity>(
		entityClass:{new ():E},
		iEntity:IE
	):Promise<E>;

	initialize():Promise<any>;

	save<E>(
		entityClass:{new ():E},
		entity:E,
		cascade?:CascadeType
	):Promise<E>;

	search<E, IE extends IEntity>(
		entityClass:{new ():E},
		iEntity:IE,
		subject?:Subject<E[]>
	):Observable<E[]>;

	searchOne<E, IE extends IEntity>(
		entityClass:{new ():E},
		iEntity:IE,
		subject?:Subject<E>
	):Observable<E>;

	update<E>(
		entityClass:{new ():E},
		entity:E,
		cascade?:CascadeType
	):Promise<E>;
}

export class EntityManager implements IEntityManager {

	deltaStore:IDeltaStore;
	online:boolean;
	offlineDeltaStore:IOfflineDeltaStore;
	localStore:LocalStoreAdaptor;

	constructor(
		public config:IPersistenceConfig
	) {
		let deltaStoreConfig = config.deltaStoreConfig;
		if (deltaStoreConfig) {
			let sharingAdaptor = getSharingAdaptor(deltaStoreConfig.setupInfo.platformType);
			this.deltaStore = new DeltaStore(deltaStoreConfig, sharingAdaptor);
			if (deltaStoreConfig.offlineDeltaStore) {
				let offlineSharingAdaptor = getOfflineSharingAdaptor(deltaStoreConfig.offlineDeltaStore.type);
				this.offlineDeltaStore = new OfflineDeltaStore(deltaStoreConfig.offlineDeltaStore, offlineSharingAdaptor);
			}
		}
		if (config.localStoreConfig) {
			this.localStore = getLocalStoreAdaptor(config.localStoreConfig.setupInfo.type, config.localStoreConfig.setupInfo.idGeneration);
		}

	}

	getLocalStore(localStoreTypeName?:string) {
		if (localStoreTypeName) {
			if (!this.localStore) {
				throw `LocalStore '${localStoreTypeName}' is not setup.`;
			}
		}
		return this.localStore;
	}

	async initialize():Promise<any> {
		let initializers:Promise<any>[] = [];

		if (this.offlineDeltaStore) {
			initializers.push(this.offlineDeltaStore.goOnline());
		}

		let localStoreConfig = this.config.localStoreConfig;
		initializers.push(this.localStore.initialize(localStoreConfig.setupInfo));

		return Promise.all(initializers);
	}

	goOffline():void {
		this.deltaStore.goOffline();
		this.online = false;
	}

	async goOnline():Promise<any> {
		let initializers:Promise<any>[] = [];

		initializers.push(this.deltaStore.goOnline());

		return Promise.all(initializers).then(results => this.online = true);
	}

	isOnline():boolean {
		return true;
	}

	async create<E>(
		entityClass:{new ():E},
		entity:E
	):Promise<E> {
		return this.persistEntity(entityClass, entity, 'create');
	}

	async delete<E>(
		entityClass:{new ():E},
		entity:E
	):Promise<E> {
		return this.persistEntity(entityClass, entity, 'delete');
	}

	async save<E>(
		entityClass:{new ():E},
		entity:E
	):Promise<E> {
		return this.persistEntity(entityClass, entity, 'persist');
	}

	async update<E>(
		entityClass:{new ():E},
		entity:E
	):Promise<E> {
		return this.persistEntity(entityClass, entity, 'update');
	}

	@Transactional()
	private async persistEntity<E>(
		entityClass:{new ():E},
		entity:E,
		operation:'create' | 'delete' | 'persist' | 'update'
	):Promise<E> {

		let changeGroup:IChangeGroup;
		await this.localStore[operation](entityClass, entity, this.localStore.activeChangeGroup);
		await this.localStore['create']('ChangeGroup', this.localStore.activeChangeGroup, new StubChangeGroup());
		changeGroup = this.localStore.activeChangeGroup;

		if (this.isOnline()) {
			await this.deltaStore.addChange(this.deltaStore.config.changeListConfig, changeGroup);
		} else {
			await this.offlineDeltaStore.addChange(this.deltaStore.config.offlineDeltaStore.config, changeGroup);
		}

		return entity;
	}

	private ensureId<E>(
		entity:E
	) {
	}

	search<E, IE extends IEntity>(
		entityClass:{new ():E},
		phRawQuery:PHRawSQLQuery<IE>,
		subject?:Subject<E[]>
	):Observable<E[]> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
		return this.localStore.search(qEntity.__entityName__, phQuery, subject);
	}

	searchOne<E, IE extends IEntity>(
		entityClass:{new ():E},
		phRawQuery:PHRawSQLQuery<IE>,
		subject?:Subject<E>
	):Observable<E> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);

		return this.localStore.searchOne(qEntity.__entityName__, phQuery, subject);
	}

	async find<E, IE extends IEntity>(
		entityClass:{new ():E},
		phRawQuery:PHRawSQLQuery<IE>
	):Promise<E[]> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
		return await <any>this.localStore.find(qEntity.__entityName__, phQuery);
	}

	async findOne<E, IE extends IEntity>(
		entityClass:{new ():E},
		phRawQuery:PHRawSQLQuery<IE>
	):Promise<E> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let phQuery = this.getPHSQLQuery(qEntity, phRawQuery);
		return await <any>this.localStore.findOne(qEntity.__entityName__, phQuery);
	}

	getPHSQLQuery<E, IE extends IEntity>(
		qEntity:any,
		phRawQuery:PHRawSQLQuery<IE>
	):PHSQLQuery<IE> {
		let qEntityMap:{[entityName:string]:QEntity<any>} = PH.qEntityMap;
		let entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}} = PH.entitiesRelationPropertyMap;
		let entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}} = PH.entitiesPropertyTypeMap;
		let phSqlQuery:PHSQLQuery<IE> = new PHSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);

		return phSqlQuery;
	}

}