import {LocalStoreAdaptor} from "../LocalStoreAdaptor";
import {LocalStoreSetupInfo} from "../LocalStoreApi";
import {IEntity, PHQuery, EntityMetadata, QEntity, SQLDialect} from "querydsl-typescript";
import {Subject, Observable} from "rxjs";
import {PH} from "../../config/PH";
import {DDLManager} from "./DDLManager";
import {IdGeneration} from "../IdGenerator";
import {PHMetadataUtils} from "../../core/metadata/PHMetadataUtils";
import {SqlAdaptor, CascadeRecord} from "../SqlAdaptor";
import {ChangeGroup} from "../../changeList/model/ChangeGroup";
import {IEntityChange} from "../../changeList/model/EntityChange";

/**
 * Created by Papa on 8/30/2016.
 */

const DB_NAME: string = 'appStorage';
const win: any = window;

export class WebSqlAdaptor extends SqlAdaptor implements LocalStoreAdaptor {

	static BACKUP_LOCAL = 2;
	static BACKUP_LIBRARY = 1;
	static BACKUP_DOCUMENTS = 0;

	private _db: any;

	private currentTransaction;

	constructor(idGeneration: IdGeneration) {
		super(idGeneration);
	}

	private getBackupLocation(dbFlag: number): number {
		switch (dbFlag) {
			case WebSqlAdaptor.BACKUP_LOCAL:
				return 2;
			case WebSqlAdaptor.BACKUP_LIBRARY:
				return 1;
			case WebSqlAdaptor.BACKUP_DOCUMENTS:
				return 0;
			default:
				throw Error('Invalid backup flag: ' + dbFlag);
		}
	}

	initialize(
		setupInfo: LocalStoreSetupInfo
	): Promise<any> {
		let dbOptions: any = {
			name: DB_NAME,
			backupFlag: WebSqlAdaptor.BACKUP_LOCAL,
			existingDatabase: false
		};

		if (win.sqlitePlugin) {
			let location = this.getBackupLocation(dbOptions.backupFlag);
			dbOptions.location = location;
			dbOptions.createFromLocation = dbOptions.existingDatabase ? 1 : 0;
			this._db = win.sqlitePlugin.openDatabase(dbOptions);
		} else {
			console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
			this._db = win.openDatabase(dbOptions.name, '1.0', 'database', 5 * 1024 * 1024);
		}

		return new Promise((resolve, reject) => {
			try {
				this._db.transaction((tx) => {
						this.initTable(tx, null, resolve, reject);
					},
					(err) => reject({err: err}));
			} catch (err) {
				reject({err: err});
			}
		});
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
			try {
				this._db.transaction((tx) => {
						this.currentTransaction = tx;
						result = callback();
						if (!(result instanceof Promise)) {
							throw `A method with @Transactional decorator must return a promise`;
						}
						result.catch((error: any) => {
							reject(error);
						}).then((value: any)=> {
							this.currentTransaction = null;
							resolve(value);
						});
					},
					(err) => reject(err));
			} catch (err) {
				reject(err);
			}
		});
	}

	async query(query: string, params = [], saveTransaction: boolean = false): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				if (this.currentTransaction) {
					this.currentTransaction.executeSql(query, params,
						(tx, res) => resolve({tx: this.currentTransaction, res: res}),
						(tx, err) => reject({tx: this.currentTransaction, err: err}));
				} else {
					this._db.transaction((tx) => {
							if (saveTransaction) {
								this.currentTransaction = tx;
							}
							tx.executeSql(query, params,
								(tx, res) => resolve({tx: tx, res: res}),
								(tx, err) => reject({tx: tx, err: err}));
						},
						(err) => reject({err: err}));
				}
			} catch (err) {
				reject({err: err});
			}
		});
	}

	protected getDialect(): SQLDialect {
		return SQLDialect.SQLITE;
	}

	protected async findNative(
		sqlQuery: string,
		parameters: any[]
	): Promise<any[]> {
		let nativeParameters = parameters.map((value) => this.convertValueIn(value));
		return await this.query(sqlQuery, nativeParameters);
	}

	handleError(error: any) {
		throw error;
	}

	initTable(
		transaction,
		lastEntityName,
		resolve,
		reject
	) {
		let currentEntityName;
		for (let entityName in PH.qEntityMap) {
			if (!lastEntityName) {
				currentEntityName = entityName;
				break;
			}
			if (lastEntityName == entityName) {
				lastEntityName = null;
				break;
			}
		}
		if (currentEntityName) {

			let createTableDDL = DDLManager.getCreateTableDDL(currentEntityName);
			let params = [];
			transaction.executeSql(createTableDDL, params,
				(tx, res) => {
					this.initTable(transaction, currentEntityName, resolve, reject);
				},
				(tx, err) => reject({tx: tx, err: err}));
		} else {
			resolve({tx: transaction, res: 'DONE'});
		}

	}

	protected async createNative(
		qEntity: QEntity<any>,
		columnNames: string[],
		values: any[],
		cascadeRecords: CascadeRecord[],
		changeGroup: ChangeGroup
	) {
		let nativeValues = values.map((value) => this.convertValueIn(value));
		let valuesBindString = values.map(() => '?').join(', ');
		let tableName = PHMetadataUtils.getTableName(qEntity);
		let sql = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${valuesBindString})`;
		if (cascadeRecords.length) {
			let startTransaction = false;
			if (!this.currentTransaction) {
				startTransaction = true;
			}
			await this.query(sql, nativeValues, startTransaction);
			for (let i = 0; i < cascadeRecords.length; i++) {
				let cascadeRecord = cascadeRecords[i];
				await this.create(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
			}
			if (startTransaction) {
				this.currentTransaction = null;
			}
		} else {
			await this.query(sql, nativeValues);
		}
	}

	protected async deleteNative(
		qEntity: QEntity<any>,
		entity: any,
		idValue: number | string,
		cascadeRecords: CascadeRecord[],
		changeGroup: ChangeGroup
	): Promise<IEntityChange> {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		let startTransaction = false;
		let transactionExists = !!this.currentTransaction;
		if (cascadeRecords.length) {
			if (!transactionExists) {
				startTransaction = true;
			}
			for (let i = 0; i < cascadeRecords.length; i++) {
				let cascadeRecord = cascadeRecords[i];
				cascadeRecord.manyEntity[cascadeRecord.mappedBy] = entity;
				await this.delete(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
			}
		}
		let entityChange = changeGroup.addNewDeleteEntityChange(qEntity.__entityName__, entity, entityMetadata.idProperty);
		let tableName = PHMetadataUtils.getTableName(qEntity);
		let idColumnName = PHMetadataUtils.getPropertyColumnName(entityMetadata.idProperty, qEntity);
		let sql = `DELETE FROM ${tableName} where ${idColumnName} = ?`;

		await this.query(sql, [idValue], startTransaction);

		if (startTransaction && !transactionExists) {
			this.currentTransaction = null;
		}

		return entityChange;
	}

	private convertValueIn(
		value: any
	): number | string {
		switch (typeof value) {
			case 'boolean':
				return value ? 1 : 0;
			case 'number':
			case 'string':
				return value;
			case 'undefined':
				return null;
			case 'object':
				if (!value) {
					return null;
				} else if (value instanceof Date) {
					return value.getTime();
				} else {
					throw `Unexpected non-date object ${value}`;
				}
			default:
				throw `Unexpected typeof value: ${typeof value}`;
		}
	}

	protected async updateNative(
		qEntity: QEntity<any>,
		columnNames: string[],
		values: any[],
		idProperty: string,
		idValue: number | string,
		cascadeRecords: CascadeRecord[],
	  changeGroup: ChangeGroup
	) {
		let setFragments: string[];
		let nativeValues = values.map((value) => this.convertValueIn(value));
		for (var i = 0; i < columnNames.length; i++) {
			setFragments.push(`${columnNames[i]} = ?`);
		}
		let tableName = PHMetadataUtils.getTableName(qEntity);
		let sql = `UPDATE ${tableName} SET ${setFragments.join(', ')}  WHERE ${idProperty} = ?`;
		nativeValues.push(idValue);
		if (cascadeRecords.length) {
			let startTransaction = false;
			if (!this.currentTransaction) {
				startTransaction = true;
			}
			await this.query(sql, values, startTransaction);
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
			if (startTransaction) {
				this.currentTransaction = null;
			}
		} else {
			await this.query(sql, values);
		}
	}

	search < E, IE extends IEntity >(
		entityName: string,
		phQuery: PHQuery < IE >,
		subject ?: Subject < E[] >
	): Observable < E[] > {
		return null;
	}

	searchOne < E, IE extends IEntity >(
		entityName: string,
		phQuery: PHQuery < IE >,
		subject ?: Subject < E >
	): Observable < E > {
		return null;
	}

	warn(
		message: string
	) {
		console.log(message);
	}

}