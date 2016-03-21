import {Model} from "./Entity";
import reflection from '../util/Reflection';

/**
 * Created by Papa on 3/17/2016.
 */

export interface IEntityRegistry {

  register( modelClass:Model ):void;

  get(
    EntityClassName:string
  ):Model;

}

export class EntityRegistry implements IEntityRegistry {

  private static REGISTRY = new EntityRegistry();

  static add(
    ModelClass:any
  ):void {
    this.REGISTRY.register(ModelClass)
  }

  static find(
    EntityClassName:string
  ):any {
    return this.REGISTRY.get(EntityClassName);
  }

  constructor(
    private classMap:{[ClassName:string]:Model} = {}
  ) {
  }

  register(
    ModelClass:any
  ):void {
    let className = reflection.getClassName(ModelClass);
    this.classMap[className] = modelClass;
    this.classMap[className + 'List'] = modelClass;
    this.classMap[className + 'Map'] = modelClass;
  }

  get(
    EntityClassName:string
  ):any {
    return this.classMap[EntityClassName];
  }

}
