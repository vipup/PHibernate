/**
 * Created by Papa on 5/23/2016.
 */

import {getSharingAdaptor, IDeltaStore, DeltaStore} from "../../changeList/DeltaStore";
import {IPersistenceConfig} from "../../config/PersistenceConfig";
import {getLocalStoreAdaptor} from "../../localStore/LocalStore";
import {LocalStoreAdaptor} from "../../localStore/LocalStoreAdaptor";
import {getOfflineSharingAdaptor} from "../../changeList/OfflineStore";
import {EntityProxy} from "../proxy/Proxies";
import {QEntity, IEntity, PHQuery, RelationType} from "querydsl-typescript/lib/index";
import {Observable} from "rxjs/Observable";
import {PH} from "../../config/PH";
import {RelationRecord} from "querydsl-typescript/lib/core/entity/Relation";
import {EntityUtils} from "../../shared/EntityUtils";
import {CascadeType} from "../../config/JPAApi";
import {IEntityConfig} from "../../config/EntityConfig";

export interface IEntityManager {

	goOffline():void;
	goOnline():Promise<any>;
	initialize():Promise<any>;
	isOnline():boolean;

	create<E>(
		entity:E,
	  cascade?:CascadeType
	):Promise<E>;

	delete<E>(
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
		entity:E,
		cascade?:CascadeType
	):Promise<E>;

	search<E, IE extends IEntity>(
		entityClass:{new ():E},
		iEntity:IE
	):Observable<E[]>;

	searchOne<E, IE extends IEntity>(
		entityClass:{new ():E},
		iEntity:IE
	):Observable<E>;

	update<E>(
		entity:E,
		cascade?:CascadeType
	):Promise<E>;
}

export class EntityManager implements IEntityManager {

	deltaStoreMap:{[deltaStoreName:string]:IDeltaStore} = {};
	online:boolean;
	offlineDeltaStore:IDeltaStore;
	localStoreMap:{[localStoreTypeName:string]:LocalStoreAdaptor} = {};

	constructor(
		public config:IPersistenceConfig
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
				let localStoreConfig = config.localStoreConfigMap[localStoreName];
				let localStoreAdaptor = getLocalStoreAdaptor(localStoreConfig.setupInfo.type);
				this.localStoreMap[localStoreName] = localStoreAdaptor;
			}
		}

	}

	async initialize():Promise<any> {
		let initializers:Promise<any>[] = [];

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

	goOffline():void {
		for (let deltaStoreName in this.deltaStoreMap) {
			let deltaStore = this.deltaStoreMap[deltaStoreName];
			deltaStore.goOffline();
		}
		this.online = false;
	}

	async goOnline():Promise<any> {
		let initializers:Promise<any>[] = [];

		for (let deltaStoreName in this.deltaStoreMap) {
			let deltaStore = this.deltaStoreMap[deltaStoreName];
			initializers.push(deltaStore.goOnline());
		}

		return Promise.all(initializers).then(results => this.online = true);
	}

	isOnline():boolean {
		return true;
	}

	async create<E>(
		entity:E,
		cascadeRule?:CascadeType
	):Promise<E> {
		return this.persistEntity(entity, 'create', cascadeRule);
	}

	async delete<E>(
		entity:E,
		cascadeRule?:CascadeType
	):Promise<E> {
		return this.persistEntity(entity, 'delete', cascadeRule);
	}

	async save<E>(
		entity:E,
		cascadeRule?:CascadeType
	):Promise<E> {
		return this.persistEntity(entity, 'persist', cascadeRule);
	}

	async update<E>(
		entity:E,
		cascadeRule?:CascadeType
	):Promise<E> {
		return this.persistEntity(entity, 'update', cascadeRule);
	}

	private async persistEntity<E>(
		entity:E,
		operation:'create' | 'delete' | 'persist' | 'update',
	  cascadeRule?:CascadeType
	):Promise<E> {
		let entityConfig = this.config.getEntityConfig(entity);
		let entityProxy:EntityProxy = <EntityProxy><any>entity;
		this.setForeignKeys(entity, cascadeRule);

		let persistedInLocalStore:boolean = false;
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			await localStore[operation](entity);
			persistedInLocalStore = true;
		}

		let persistedInDeltaStore:boolean = false;
		if (entityConfig.changeListConfig) {
			if (this.isOnline()) {
				let deltaStore = this.deltaStoreMap[entityConfig.changeListConfig.deltaStoreName];
				await deltaStore.addChange(entityConfig, entityProxy);
			} else {
				await this.offlineDeltaStore.addChange(entityConfig, entityProxy);
			}
			persistedInDeltaStore = true;
		}

		if (!persistedInDeltaStore && !persistedInLocalStore) {
			throw `Entity is not persisted in either Delta Store or Local Store`;
		}

		return entity;
	}

	private ensureId<E>(
		entity:E
	) {
	}

	private setForeignKeys<E>(
		entity:E,
	  cascadeRule?:CascadeType
	):void {
		let entityConfig = this.config.getEntityConfig(entity);
		let entityClassName = EntityUtils.getClassName(entity.constructor);
		let entityRelationPropertyMap = PH.entitiesRelationPropertyMap[entityClassName];

		for(let propertyName in entityRelationPropertyMap) {
			let relationRecord:RelationRecord = entityRelationPropertyMap[propertyName];
			if(entity[propertyName]) {
				switch(relationRecord.relationType) {
					case RelationType.MANY_TO_ONE:
						// FIXME: work here next
						break;
					default:
						// Nothing to do for One-to-Many, no foreign key in this entity
				}
			}
		}
	}

	search<IE extends IEntity>(
		entityClass:any, iEntity:IE
	):Observable<any[]> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let entityConfig = this.config.getEntityConfigFromQ(qEntity);
		let phQuery = this.getPHQuery(qEntity, iEntity);
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (localStore) {
				return localStore.search(entityClass, phQuery);
			}
		}
		throw `Entity is not setup with a LocalStore`;
	}

	searchOne<IE extends IEntity>(
		entityClass:any, iEntity:IE
	):Observable<any> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let entityConfig = this.config.getEntityConfigFromQ(qEntity);
		let phQuery = this.getPHQuery(qEntity, iEntity);
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (localStore) {
				return localStore.searchOne(entityClass, phQuery);
			}
		}
		throw `Entity is not setup with a LocalStore`;
	}

	async find<E, IE extends IEntity>(
		entityClass:{new (): E}, iEntity:IE
	):Promise<E[]> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let entityConfig = this.config.getEntityConfigFromQ(qEntity);
		let phQuery = this.getPHQuery(qEntity, iEntity);
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (localStore) {
				return await localStore.find(entityClass, phQuery);
			}
		}
		throw `Entity is not setup with a LocalStore`;
	}

	async findOne<E, IE extends IEntity>(
		entityClass:{new (): E}, iEntity:IE
	):Promise<E> {
		let qEntity = PH.getQEntityFromEntityClass(entityClass);
		let entityConfig = this.config.getEntityConfigFromQ(qEntity);
		let phQuery = this.getPHQuery(qEntity, iEntity);
		if (entityConfig.localStoreConfig) {
			let localStore = this.localStoreMap[entityConfig.localStoreConfig.setupInfo.name];
			if (localStore) {
				return await localStore.findOne(entityClass, phQuery);
			}
		}
		throw `Entity is not setup with a LocalStore`;
	}

	getPHQuery<E, IE extends IEntity>(
		qEntity:any,
		iEntity:IE
	):PHQuery {
		let qEntityMap:{[entityName:string]:QEntity<any>} = PH.qEntityMap;
		let entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}} = PH.entitiesRelationPropertyMap;
		let entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}} = PH.entitiesPropertyTypeMap;
		let phQuery:PHQuery = new PHQuery(iEntity, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);

		return phQuery;
	}

}