import {IEntity, Entity} from "../../model/entity/Entity";
import {CachedRepository} from "./../../repository/CachedRepository";
import {IDbUser, DbUser} from "../../model/entity/DbUser";
/**
 * Created by Papa on 3/17/2016.
 */

export module entity.repository {
  var ENTITY_REPOSITORY:IEntityRepository;

  /**
   * Override this method in other modules, this will allow you to use the same API and just import
   * a different file
   * @returns {IEntityCache}
   */
  export function get():IEntityCache {
    if (ENTITY_CACHE) {
      return ENTITY_CACHE;
    }
    ENTITY_CACHE = new EntityCache();

    return ENTITY_CACHE;
  }

}

export class EntityRepository<IE extends IEntity, E extends Entity> extends CachedRepository<IE> {

  constructor(
    private relationName:string,
    private relationClass:E
  ) {
  }

  abstract createJson(
    iEpic:IEpic
  ):IEpic {
    REPOES.epicRepository.createIEntity();
    let iEpic:IEpic = LabeledEntity.createILabeledEntity<IEpic>(REPOES.epicRepository);
    iEpic.rate = rate;

    return iEpic;
  }

  createEntity(
    iEntity:IEntity,
    user:IDbUser = DbUser.getCurrentSystemUser()
  ):IEpic {
    let iEpic:IEpic = LabeledEntity.createILabeledEntity(EntityName.Epic, EntityType.Epic);
    iEpic.rate = rate;

    let epic:Epic = new Epic(iEpic);

    return iEpic;
  }

}
