import {SqlAdaptor, CascadeRecord} from "../SqlAdaptor";
import {ChangeGroup, ChangeGroupApi} from "../../changeList/model/ChangeGroup";
import {SQLDialect, QEntity, EntityMetadata, PHQuery, IEntity} from "querydsl-typescript";
import {IEntityChange} from "../../changeList/model/EntityChange";
import {Subject, Observable} from "rxjs";
import {ILocalStoreAdaptor} from "../LocalStoreAdaptor";
import {LocalStoreSetupInfo} from "../LocalStoreApi";
/**
 * Created by Papa on 9/20/2016.
 */

export class StubSqlAdaptor extends SqlAdaptor implements ILocalStoreAdaptor {

	private currentTransaction: boolean = false;

	initialize(
		setupInfo:LocalStoreSetupInfo
	):Promise<any> {
			return null;
	}

	wrapInTransaction(callback: ()=> Promise<any>): Promise<any> {
		let result;
		if (this.currentTransaction) {
			result = callback();
			if (!(result instanceof Promise)) {
				throw `A method with @Transactional decorator must return a promise`;
			}
			return result;
		}
		return new Promise((resolve, reject) => {
			this.currentTransaction = true;
			this.currentChangeGroup = ChangeGroup.getNewChangeGroup('Transactional', this.idGenerator);
			result = callback();
			if (!(result instanceof Promise)) {
				throw `A method with @Transactional decorator must return a promise`;
			}
			result.then((value: any)=> {
				this.currentTransaction = null;
				this.currentChangeGroup = null;
				resolve(value);
			}).catch((error: any) => {
				reject(error);
			})
		});
	}

	protected getDialect(): SQLDialect {
		return null;
	}

	protected async findNative(
		sqlQuery: string,
		parameters: any[]
	): Promise<any[]> {
		throw `Unexpected find call`;
	}

	protected async createNative(
		qEntity: QEntity<any>,
		columnNames: string[],
		values: any[],
		cascadeRecords: CascadeRecord[],
		changeGroup: ChangeGroupApi
	): Promise<void> {
		if (cascadeRecords.length) {
			for (let i = 0; i < cascadeRecords.length; i++) {
				let cascadeRecord = cascadeRecords[i];
				await this.create(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
			}
		}
	}

	protected async deleteNative(
		qEntity: QEntity<any>,
		entity: any,
		idValue: number | string,
		cascadeRecords: CascadeRecord[],
		changeGroup: ChangeGroupApi
	): Promise<IEntityChange> {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		if (cascadeRecords.length) {
			for (let i = 0; i < cascadeRecords.length; i++) {
				let cascadeRecord = cascadeRecords[i];
				cascadeRecord.manyEntity[cascadeRecord.mappedBy] = entity;
				await this.delete(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
			}
		}
		let entityChange = changeGroup.addNewDeleteEntityChange(qEntity.__entityName__, entity, entityMetadata.idProperty);

		return entityChange;
	}

	protected async updateNative(
		qEntity: QEntity<any>,
		columnNames: string[],
		values: any[],
		idProperty: string,
		idValue: number | string,
		cascadeRecords: CascadeRecord[],
		changeGroup: ChangeGroupApi
	): Promise<void> {
		if (cascadeRecords.length) {
			for (let i = 0; i < cascadeRecords.length; i++) {
				let cascadeRecord = cascadeRecords[i];
				switch (cascadeRecord.cascadeType) {
					case "create":
						await this.create(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
						break;
					case "update":
						await this.update(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
						break;
					case "remove":
						throw `Cascading removes from an update are not supported`;
				}
			}
		}
	}

	search < E, IE extends IEntity >(
		entityName: string,
		phQuery: PHQuery < IE >,
		subject ?: Subject < E[] >
	): Observable < E[] > {
		throw `Unexpected search call`;
	}

	searchOne < E, IE extends IEntity >(
		entityName: string,
		phQuery: PHQuery < IE >,
		subject ?: Subject < E >
	): Observable < E > {
		throw `Unexpected searchOne call`;
	}

	warn(
		message: string
	) {
		console.log(message);
	}

}