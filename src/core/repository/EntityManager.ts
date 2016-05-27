import {PersistenceConfiguration} from "./PersistenceConfiguration";
import {getSharingAdaptor} from "./DeltaStore";
/**
 * Created by Papa on 5/23/2016.
 */

export interface IEntityManager {

	save<E>(
		entity?:E
	):Promise<E>;

	delete<E>(
		entity:E
	):Promise<void>;
}

export class EntityManager {

	save<E>(
		entity?:E
	):Promise<E> {
		if(entity) {
			return this.saveEntity(entity);
		}
		return null;
	}

	delete<E>(
		entity:E
	):Promise<void> {
		return null;
	}

	private saveEntity<E>(
		entity:E
	):Promise<E> {
		let config = this.getConfiguration();
		if(config.changeList) {
			let sharingAdaptor = getSharingAdaptor(ShareInfo.GOOGLE);
		}
		return null;
	}
	
	private getConfiguration():PersistenceConfiguration {
		return null;
	}

}