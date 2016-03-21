import {Model, Entity} from "./Entity";
import {getClassName} from "../util/Reflection";
import {IDbObject, IDbObjectClass} from "../model/db/DbObject";
import {proxy} from "./ProxyGenerator";

/**
 * Created by Papa on 3/17/2016.
 */

export interface ISingleEntityCache {

  add(
    entity:IDOC
  ):void;

  get(
    jsonCore:IDbObject
  ):E;

}

export class SingleEntityCache<IDOC extends IDbObjectClass> implements ISingleEntityCache {

  constructor(
    private entityClass:IDOC,
    private singleEntityMap:{[_id:string]:Entity} = {}
  ) {
  }

  add(
    entity:IDOC
  ):void {
    validateEntity(entity);
    this.singleEntityMap[entity._id] = entity;
  }

  get(
    jsonCore:IDbObject
  ):IDOC {
    proxy.validateJsonCore(jsonCore);
    this.validateJsonCoreType(jsonCore);
    return this.singleEntityMap[jsonCore._id];
  }

  private validateEntity(
    entity:Entity
  ):void {
    if (!entity || !entity.__originalJson) {
      throw `Invalid entity`;
    }
    let jsonObject = entity.__originalJson;
    proxy.validateJsonObject(jsonObject);
    this.validateJsonCoreType(jsonObject);
  }

  private validateJsonCoreType(
    jsonCore:IDbObject
  ):void {
    if (jsonCore._type !== this.entityClass._type) {
      throw `Invalid jsonObject._type, expecting: '${this.entityClass._type}', got: '${this.jsonCore._type}'`;
    }
  }

}

export interface IEntityCache {

  getSingleEntityCache<IDOC extends IDbObjectClass>(
    EntityClass:IDOC
  ):ISingleEntityCache;

}

export module entity.cache {
  var ENTITY_CACHE:IEntityCache;

  /**
   * Override this method in other modules, this will allow you to use the same API and just import
   * a different file
   * @returns {IEntityCache}
   */
  export function get():IEntityCache {
    if (ENTITY_CACHE) {
      return ENTITY_CACHE;
    }
    ENTITY_CACHE = new CouchDbEntityCache();

    return ENTITY_CACHE;
  }
}

export class CouchDbEntityCache implements IEntityCache {

  static CACHE = new CouchDbEntityCache();

  constructor(
    private entityMap:{[EntityClassName:string]:SingleEntityCache} = {}
  ) {
  }

  getSingleEntityCache<IDOC extends IDbObjectClass>(
    EntityClass:IDOC
  ):ISingleEntityCache {
    let EntityClassName = getClassName(EntityClass);

    let singleEntityCache = this.entityMap[EntityClassName];
    if (!singleEntityCache) {
      singleEntityCache = new SingleEntityCache(EntityClass);
      this.entityMap[EntityClassName] = singleEntityCache;
    }

    return singleEntityCache;
  }
}
