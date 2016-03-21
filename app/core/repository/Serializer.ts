import {IModel, IEntity, Entity} from "../model/entity/Entity";
import {EntityRegistry} from "./../entity/registry/EntityRegistry";
import {CouchDbEntityCache} from "./EntityCache";
/**
 * Created by Papa on 3/17/2016.
 */

export function updateModelFromJson(
  jsonObject:IModel,
  modelObject:IModel
) {

  export class Serializer {

    constructor(
      private entityCache:CouchDbEntityCache,
      private entityRegistry:EntityRegistry
    ) {
    }

    deserialize<IM extends IModel>(
      jsonObject:any,
      ModelClass:IM
    ):IM {
      let model = new ModelClass();

      for (let property in jsonObject) {
        let attribute = jsonObject[property];
        if (!attribute) {

        }
        Object.getOwnPropertyNames(arr);
        obj.propertyIsEnumerable(prop);

        Array.isArray(attribute);
        if (typeof attribute === "object") {
          let attributeObjectClass = this.entityRegistry.get(property);
          let attributeObject =
        }
      }
    }
  }
}
