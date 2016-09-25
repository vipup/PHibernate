"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const LocalStoreApi_1 = require("../LocalStoreApi");
const querydsl_typescript_1 = require("querydsl-typescript");
const PH_1 = require("../../config/PH");
const DDLManager_1 = require("./DDLManager");
const PHMetadataUtils_1 = require("../../core/metadata/PHMetadataUtils");
const SqlAdaptor_1 = require("../SqlAdaptor");
const ChangeGroup_1 = require("../../changeList/model/ChangeGroup");
/**
 * Created by Papa on 8/30/2016.
 */
const DB_NAME = 'appStorage';
const win = window;
class WebSqlAdaptor extends SqlAdaptor_1.SqlAdaptor {
    constructor(entityManager, idGeneration) {
        super(entityManager, idGeneration);
        this.type = LocalStoreApi_1.LocalStoreType.SQLITE_CORDOVA;
    }
    getBackupLocation(dbFlag) {
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
    initialize(setupInfo) {
        let dbOptions = {
            name: DB_NAME,
            backupFlag: WebSqlAdaptor.BACKUP_LOCAL,
            existingDatabase: false
        };
        if (win.sqlitePlugin) {
            let location = this.getBackupLocation(dbOptions.backupFlag);
            dbOptions.location = location;
            dbOptions.createFromLocation = dbOptions.existingDatabase ? 1 : 0;
            this._db = win.sqlitePlugin.openDatabase(dbOptions);
        }
        else {
            console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
            this._db = win.openDatabase(dbOptions.name, '1.0', 'database', 5 * 1024 * 1024);
        }
        return new Promise((resolve, reject) => {
            try {
                this._db.transaction((tx) => {
                    this.initTable(tx, null, resolve, reject);
                }, (err) => reject({ err: err }));
            }
            catch (err) {
                reject({ err: err });
            }
        });
    }
    wrapInTransaction(callback) {
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
                    this.currentChangeGroup = ChangeGroup_1.ChangeGroup.getNewChangeGroup('Transactional', this.idGenerator);
                    result = callback();
                    if (!(result instanceof Promise)) {
                        throw `A method with @Transactional decorator must return a promise`;
                    }
                    let returnedValue;
                    result.then((value) => {
                        returnedValue = value;
                        return this.entityManager.saveActiveChangeGroup();
                    }).then(() => {
                        this.currentTransaction = null;
                        this.currentChangeGroup = null;
                        resolve(returnedValue);
                    }).catch((error) => {
                        reject(error);
                    });
                }, (err) => reject(err));
            }
            catch (err) {
                reject(err);
            }
        });
    }
    query(query, params = [], saveTransaction = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    if (this.currentTransaction) {
                        this.currentTransaction.executeSql(query, params, (tx, res) => resolve({ tx: this.currentTransaction, res: res }), (tx, err) => reject({ tx: this.currentTransaction, err: err }));
                    }
                    else {
                        this._db.transaction((tx) => {
                            if (saveTransaction) {
                                this.currentTransaction = tx;
                            }
                            tx.executeSql(query, params, (tx, res) => resolve({ tx: tx, res: res }), (tx, err) => reject({ tx: tx, err: err }));
                        }, (err) => reject({ err: err }));
                    }
                }
                catch (err) {
                    reject({ err: err });
                }
            });
        });
    }
    getDialect() {
        return querydsl_typescript_1.SQLDialect.SQLITE;
    }
    findNative(sqlQuery, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let nativeParameters = parameters.map((value) => this.convertValueIn(value));
            return yield this.query(sqlQuery, nativeParameters);
        });
    }
    handleError(error) {
        throw error;
    }
    initTable(transaction, lastEntityName, resolve, reject) {
        let currentEntityName;
        for (let entityName in PH_1.PH.qEntityMap) {
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
            let createTableDDL = DDLManager_1.DDLManager.getCreateTableDDL(currentEntityName);
            let params = [];
            transaction.executeSql(createTableDDL, params, (tx, res) => {
                this.initTable(transaction, currentEntityName, resolve, reject);
            }, (tx, err) => reject({ tx: tx, err: err }));
        }
        else {
            resolve({ tx: transaction, res: 'DONE' });
        }
    }
    createNative(qEntity, columnNames, values, cascadeRecords, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            let nativeValues = values.map((value) => this.convertValueIn(value));
            let valuesBindString = values.map(() => '?').join(', ');
            let tableName = PHMetadataUtils_1.PHMetadataUtils.getTableName(qEntity);
            let sql = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${valuesBindString})`;
            if (cascadeRecords.length) {
                let startTransaction = false;
                if (!this.currentTransaction) {
                    startTransaction = true;
                }
                yield this.query(sql, nativeValues, startTransaction);
                for (let i = 0; i < cascadeRecords.length; i++) {
                    let cascadeRecord = cascadeRecords[i];
                    yield this.create(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
                }
                if (startTransaction) {
                    this.currentTransaction = null;
                }
            }
            else {
                yield this.query(sql, nativeValues);
            }
        });
    }
    deleteNative(qEntity, entity, idValue, cascadeRecords, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityMetadata = qEntity.__entityConstructor__;
            let startTransaction = false;
            let transactionExists = !!this.currentTransaction;
            if (cascadeRecords.length) {
                if (!transactionExists) {
                    startTransaction = true;
                }
                for (let i = 0; i < cascadeRecords.length; i++) {
                    let cascadeRecord = cascadeRecords[i];
                    cascadeRecord.manyEntity[cascadeRecord.mappedBy] = entity;
                    yield this.delete(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
                }
            }
            let entityChange = changeGroup.addNewDeleteEntityChange(qEntity.__entityName__, entity, entityMetadata.idProperty);
            let tableName = PHMetadataUtils_1.PHMetadataUtils.getTableName(qEntity);
            let idColumnName = PHMetadataUtils_1.PHMetadataUtils.getPropertyColumnName(entityMetadata.idProperty, qEntity);
            let sql = `DELETE FROM ${tableName} where ${idColumnName} = ?`;
            yield this.query(sql, [idValue], startTransaction);
            if (startTransaction && !transactionExists) {
                this.currentTransaction = null;
            }
            return entityChange;
        });
    }
    convertValueIn(value) {
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
                }
                else if (value instanceof Date) {
                    return value.getTime();
                }
                else {
                    throw `Unexpected non-date object ${value}`;
                }
            default:
                throw `Unexpected typeof value: ${typeof value}`;
        }
    }
    updateNative(qEntity, columnNames, values, idProperty, idValue, cascadeRecords, changeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            let setFragments;
            let nativeValues = values.map((value) => this.convertValueIn(value));
            for (var i = 0; i < columnNames.length; i++) {
                setFragments.push(`${columnNames[i]} = ?`);
            }
            let tableName = PHMetadataUtils_1.PHMetadataUtils.getTableName(qEntity);
            let sql = `UPDATE ${tableName} SET ${setFragments.join(', ')}  WHERE ${idProperty} = ?`;
            nativeValues.push(idValue);
            if (cascadeRecords.length) {
                let startTransaction = false;
                if (!this.currentTransaction) {
                    startTransaction = true;
                }
                yield this.query(sql, values, startTransaction);
                for (let i = 0; i < cascadeRecords.length; i++) {
                    let cascadeRecord = cascadeRecords[i];
                    switch (cascadeRecord.cascadeType) {
                        case "create":
                            yield this.create(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
                            break;
                        case "update":
                            yield this.update(cascadeRecord.entityName, cascadeRecord.manyEntity, changeGroup);
                            break;
                        case "remove":
                            throw `Cascading removes from an update are not supported`;
                    }
                }
                if (startTransaction) {
                    this.currentTransaction = null;
                }
            }
            else {
                yield this.query(sql, values);
            }
        });
    }
    search(entityName, phQuery, subject) {
        return null;
    }
    searchOne(entityName, phQuery, subject) {
        return null;
    }
    warn(message) {
        console.log(message);
    }
}
WebSqlAdaptor.BACKUP_LOCAL = 2;
WebSqlAdaptor.BACKUP_LIBRARY = 1;
WebSqlAdaptor.BACKUP_DOCUMENTS = 0;
exports.WebSqlAdaptor = WebSqlAdaptor;
//# sourceMappingURL=WebSqlAdaptor.js.map