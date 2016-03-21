import {IEntity} from "../entity/Entity";
/**
 * Created by Papa on 3/15/2016.
 */

export class GraphNode {
  addEntity<IE extends IEntity, E extends Entity>(
    company:Company,
    iEntity:IE,
    EntityClass:E
  ):E {
    let entity:E = new EntityClass(iEntity);
  }
}
