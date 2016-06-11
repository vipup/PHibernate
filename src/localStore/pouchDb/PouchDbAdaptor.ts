import {LocalStoreAdaptor} from "../LocalStoreAdaptor";
import {PouchDbStore, PouchDbStoreSetupInfo, PouchDbStoreShareInfo} from "./PouchDbApi";
import {IQEntity} from "querydsl-typescript/lib/index";
/**
 * Created by Papa on 5/28/2016.
 */

export class PouchDbAdaptor implements LocalStoreAdaptor {

	async initialize(
		setupInfo:PouchDbStoreSetupInfo
	):Promise<any> {
		return null;
	}

	async create<E>(
		entity:E
	):Promise<E> {
		return null;
	}

	async delete<E>(
		entity:E
	):Promise<E> {
		return null;
	}

	async query<E, IQE extends IQEntity<IQE>>(
		qEntity:IQE
	):Promise<E> {
		return null;
	}

	async persist<E>(
		entity:E
	):Promise<E> {
		return null;
	}

	async update<E>(
		entity:E
	):Promise<E> {
		return null;
	}

}