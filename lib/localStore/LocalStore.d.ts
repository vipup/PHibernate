import { LocalStoreType } from "./LocalStoreApi";
import { ILocalStoreAdaptor } from "./LocalStoreAdaptor";
import { IdGeneration } from "./IdGenerator";
import { IEntityManager } from "../core/repository/EntityManager";
export declare function getLocalStoreAdaptor(localStoreType: LocalStoreType, entityManager: IEntityManager, idGeneration: IdGeneration): ILocalStoreAdaptor;
export declare function getSQLiteAdaptor(entityManager: IEntityManager, idGeneration: IdGeneration): ILocalStoreAdaptor;
