import {EntityRegistry} from "./../entity/registry/EntityRegistry";
import {CouchDbEntityCache} from "./EntityCache";
import {Entity, IEntity, IEntityClass} from "../model/entity/Entity";
import {IDbObjectClass, IDbObject} from "../model/db/DbObject";
import {ChangeRecord} from "delta-store/lib/index";
/**
 * Created by Papa on 3/18/2016.
 */

export interface IEntityProxyWrapper<IPE extends IProxiedEntity> {
  get:{():Proxy<IPE>};
  set:{( value:IPE ):void};
}

export interface IProxiedEntity extends IEntity {
}

export interface IProxiedEntityClass extends IEntityClass {
  ___proxyWrapperMap:{[proxyName:string]:IEntityProxyWrapper};
  ___propertyWrapperMap:{[propertyName:string]:IEntityProxyWrapper};
}

export interface IArrayProxy {

}

export module entity.proxy {

  export function generateStub<IE extends IEntity, IPE extends IProxiedEntity>(
    object:IE
  ):IPE {
    this.generateObjectStub(object);
    this.initDataStructures(object);

    let ownPropertyNames = Object.getOwnPropertyNames(object);
    for (let ownPropertyName in ownPropertyNames) {
      // Proxies are not needed for reserved properties since they will
      // never be modified manually
      if (Entity.RESERVED_PROPERTY_MAP[ownPropertyName]) {
        continue;
      }
      let property = object[ownPropertyName];

      // Do not create proxies for functions - they are assumed to be just logic
      if (typeof property === 'function') {
        continue;
      }
      // We are only interested in enumerable properties
      if (!object.propertyIsEnumerable(ownPropertyName)) {
        continue;
      }

      let wrapperCodeExits = this.hasWrapper(object, ownPropertyName);

      // If it's a List,
      if (string.endsWith(ownPropertyName, 'List')) {
        let list = object[ownPropertyName];
        this.processList(list, object);
        continue;
      } else
      // If it's a Map
      if (string.endsWith(ownPropertyName, 'Map')) {
        continue;
      }

      let firstLetter = ownPropertyName.charAt(0);
      // If it's an Entity reference
      if (firstLetter === firstLetter.toUpperCase()) {
        let entity = processEntity(ownPropertyName, object);
        object[ownPropertyName] = entity;

        continue;
      }
      // Must be a regular property
      generatePropertyWrapper(object, ownPropertyName);
    }

  }

  export function processEntity(
    EntityClassName:string,
    parentObject:any
  ):Entity {
    let EntityClass = EntityRegistry.find(EntityClassName);
    if (!EntityClass) {
      throw `Entity Class ${EntityClassName} is not found.`;
    }

    let entityJson = parentObject[EntityClassName];

    let entity = new EntityClass(entityJson);

    return entity;
  }

  export function processList(
    list:Array,
    parentObject:any
  ) {
    if (!set) {
      return;
    }
    let foundObjects:boolean = false;
    let foundOther:boolean = false;
    list.forEach(( childObject ) => {
      // If its a sub array
      if (childObject instanceof Array) {
        throw `Nested arrays in entities are not supported`;
      } else
      // If it's an object
      if (!(childObject instanceof Object)) {
        foundOther = true;
        return;
      }
      if (!childObject._id || !childObject.type) {
        throw `Nested maps in entities are not supported`
        l
      }
      // Else, must be an entity
    });
  }

  function hasWrapper(
    object:IProxiedEntity,
    propertyName:string
  ):boolean {
    let proxiedClass:IProxiedEntityClass = object.constructor.prototype;
    if (proxiedClass.___propertyWrapperMap[propertyName]
      || proxiedClass.___proxyWrapperMap[propertyName]
    ) {
      return true;
    }
    return false;
  }

  function generatePropertyWrapper(
    object:IProxiedEntity,
    propertyName:string
  ):void {
    object.__data__[propertyName] = object[propertyName];
    let propertyWrapper:IEntityProxyWrapper = {
      get: function () {
        return object.__data__[propertyName];
      },
      set: function ( value ) {
        let currentValue = object.__data__[propertyName];
        if (currentValue === value) {
          return;
        }
        object.__isDirty__ = true;
        object.__data__[propertyName] = value;
      }
    };
    let proxiedClass:IProxiedEntityClass = object.constructor.prototype;
    proxiedClass.___propertyWrapperMap[propertyName] = propertyWrapper;

    Object.defineProperty(proxiedClass, propertyName, propertyWrapper);
  }

  function generateSetProxy(
    object:IProxiedEntity,
    ArrayProxyName:string
  ):void {
    object.__data__[propertyName] = [];
  }

  export function validateJsonCore(
    jsonCore:IDbObject
  ):void {
    if (!jsonCore._id || !jsonCore._type) {
      throw `Invalid JSON DbObject, jsonObject._id || ._type ARE NOT specified`;
    }
  }

  export function validateJsonObject(
    jsonObject:IDbObject
  ):void {
    validateJsonCore(jsonObject);
    if (!jsonObject._rev) {
      throw `Invalid JSON DbObject - Object, jsonObject._rev IS NOT present, assuming object is a stub`;
    }
  }

  export function validateJsonStub(
    jsonStub:IDbObject
  ):void {
    validateJsonCore(jsonStub);
    if (jsonStub._rev) {
      throw `Invalid JSON DbObject - Stub, jsonObject._rev IS present, assuming object is already loaded`;
    }
  }

  function generateObjectStub<IE extends IEntity>(
    jsonStub:IE
  ):void {
    validateJsonStub(jsonStub);

    let ObjectClass:IProxiedEntityClass = this.entityRegistry.get(jsonStub._type);
    let object = new ObjectClass(jsonStub);
  }

  function verifyProxyJson(
    jsonProxyObject:any
  ):void {

  }

  /**
   * Generate a proxy for a property representing a object relation.  Ex:
   * {
   *  SomeEntity: {
   *  _id: "EntityClassName_2016-03-18-17-19-42-000_UserX_1"
   * }
   * @param parentObject
   * @param ProxiedClassName
   */
  function generateProxyWrapper(
    parentObject:IProxiedEntity,
    propertyName:string,
    ProxiedObjectClass:any
  ) {
    let jsonProxyObject = parentObject[ProxiedClassName];
    verifyProxyJson(jsonProxyObject);
    // let ProxiedObjectClass:IProxiedEntityClass = this.entityRegistry.get(ProxiedClassName);
    let object = new ProxiedObjectClass(jsonProxyObject);

    let propertyWrapper:IEntityProxyWrapper = {
      get: async function ():Promise<any> {
        let propertyObject = object[propertyName];
        if (propertyObject) {
          return await propertyObject;
        }
        // TODO: retrieve object from local storage
        return object.__data__[propertyName];
      },
      set: function ( value ):void {
        object[propertyName] = value;
      }
    };
    let parentObjectClass:IProxiedEntityClass = parentObject.constructor.prototype;
    parentObjectClass.___propertyWrapperMap[ProxiedClassName] = propertyWrapper;

    Object.defineProperty(parentObjectClass, ProxiedClassName, propertyWrapper);

  }

  function initDataStructures(
    object:IProxiedEntity
  ):any {
    if (!object.__originalJson) {
      object.__originalJson = {};
    }
    let proxiedClass:IProxiedEntityClass = object.constructor.prototype;
    if (!proxiedClass.___propertyWrapperMap) {
      proxiedClass.___propertyWrapperMap = {};
    }
    if (!proxiedClass.___proxyWrapperMap) {
      proxiedClass.___proxyWrapperMap = {};
    }
  }

}
