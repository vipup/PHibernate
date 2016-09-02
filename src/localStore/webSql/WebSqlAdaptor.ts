import {LocalStoreAdaptor} from "../LocalStoreAdaptor";
import {LocalStoreSetupInfo} from "../LocalStoreApi";
import {IEntity, PHQuery, EntityMetadata} from "querydsl-typescript";
import {Subject, Observable} from "rxjs";
import {PH} from "../../config/PH";
import {DDLManager} from "./DDLManager";

/**
 * Created by Papa on 8/30/2016.
 */

const DB_NAME: string = 'appStorage';
const win: any = window;

export class WebSqlAdaptor implements LocalStoreAdaptor {

	static BACKUP_LOCAL = 2;
	static BACKUP_LIBRARY = 1;
	static BACKUP_DOCUMENTS = 0;

	private _db: any;

	private currentTransaction;

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

	create<E>(
		entity: E
	): Promise<E> {
		let sql = `INSERT INTO A VALUES (?, ?), ['a', 2]`;
		return null;
	}

	delete<E>(
		entity: E
	): Promise<E> {
		let sql = `DELETE FROM A where b = ?`;
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
		let sql = `UPDATE A SET b = ?  WHERE c = ?`;
		return null;
	}

}