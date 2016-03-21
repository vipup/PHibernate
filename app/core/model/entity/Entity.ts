/**
 * Created by Papa on 3/14/2016.
 */

import {IDbObject, DbObject} from "../db/DbObject";
import {CachedRepository} from "../../repository/CachedRepository";
import {IDbUser} from "./core/DbUser";
import {getCurrentQueriableTimeStamp} from "../util/Dates";
import {EntityRepository} from "../../entity/cache/repository/EntityRepository";
import proxy from '../../repository/ProxyGenerator';
import reflection from '../util/Reflection';
import {EntityRegistry} from "../../entity/registry/EntityRegistry";
import {IProxiedEntity} from "../../repository/ProxyGenerator";

export interface IEntityClass extends IDbObjectClass {
}

export interface IEntity extends IDbObject {
  __originalJson:{[propertyName:string]:any};
  _createAudit:IEditAudit;
  _updateAudits:IEditAudit[];
}

export class IEditAudit {
  timeStamp:string;
  user:IDbUser;
}

export abstract class Entity extends DbObject implements IEntity, IProxiedEntity {

  static RESERVED_PROPERTY_MAP = {
    __cacheIndex: true,
    __originalJson: true,
    __repository: true,
    _createAudit: true,
    _id: true,
    _rev: true,
    _type: true,
    _updateAudits: true
  };

  __cacheIndex:number;
  __loaded:boolean;
  __originalJson:any;
  __repository:IEntityRepository;
  // Audit records do not need to be copied to the object, the original record is aways up to date
  // so we only need one copy

  constructor(
    private __originalJson:any = {},
    private __repository:TimeEntryRepository = null
  ) {
    if (__originalJson._id) {
      this._id = __originalJson._id;
      this.__loaded = !!__originalJson._rev;
    } else {
      this.__loaded = true;
      let nowStamp = getCurrentQueriableTimeStamp();
      let type = this.repository ? this.repository.type : null;
      let createUser = this.repository ? this.repository.currentUser : null;

      this.setOriginalData('type', type);
      this.setOriginalData('createAudit', {
        timeStamp: nowStamp,
        user: createUser
      });
      this.setOriginalData('updateAudits', []);

      proxy.generateStub(this);
    }
  }

  private setOriginalData(
    propertyName:string,
    data:any
  ):void {
    this.__originalJson[propertyName] = data;
    this[propertyName] = data;
  }


  static resolveMany<E extends Entity>(
    public entities:E[]
  ):Promise<E[]> {
    if (entities.length === 0) {
      return Promise.resolve(entities);
    }

    let iEntityIds:string[] = [];
    let entityMap:{[id:string]:E} = {};
    entities.forEach(( entity ) => {
      iEntityIds.push(entity.iEntity._id);
      entityMap[entity.iEntity._id] = entity;
    });

    let repository = entities[0].getRepository();

    return repository.getAllByIds(iEntityIds).then((
      iEntities
    ) => {
      iEntities.forEach(( iEntity ) => {
        entityMap[iEntity._id].iEntity = iEntity;
      });

      return entities;
    });
  }

  initUnitArray<IE extends IEntity, Us extends IEntityUnits>(
    unitArrayName:string,
    units:Us,
    required:boolean = false
  ):boolean {
    if (!units) {
      throw `&lt;IE extends IEntity&gt>.units not specified`;
    }
    let unitArrayMap;
    if (this.maintainArrayUnitsMaps) {
      unitArrayMap = {};
      this.unitArrayMaps[unitArrayName] = unitArrayMap;
    }
    let exists = !!units[unitArrayName];
    if (!exists) {
      if (required) {
        throw `Unit Array ${unitArrayName} is required and is not specified`;
      }
      units[unitArrayName] = [];
    }
    let unitArray = [];
    units[unitArrayName].forEach(( unitArrayEntry ) => {
      let _id = unitArrayEntry._id;
      if (!_id) {
        throw `Invalid unitArrayEntry for unitArray: ${unitArrayName}, '_id' is not specified`;
      }
      unitArrayEntry = {
        _id: _id
      };
      if (this.maintainArrayUnitsMaps) {
        unitArrayMap[_id] = unitArrayEntry;
      }
      unitArray.push(unitArrayEntry);
    });
    this.units[unitArrayName] = unitArray;

    return exists;
  }

  initRequiredSingletonUnit<Us extends IEntityUnits>(
    singletonUnitName:string,
    units:Us
  ):boolean {
    return this.initSingletonUnit(singletonUnitName, units, true);
  }

  initSingletonUnit<Us extends IEntityUnits>(
    singletonUnitName:string,
    units:Us,
    required:boolean = false
  ):boolean {
    if (!units) {
      throw `&lt;IE extends IEntity&gt>.units not specified`;
    }
    let exists = !!units[singletonUnitName];
    if (exists) {
      let id = units[singletonUnitName]._id;
      if (!id) {
        throw `Invalid Singleton Unit ${singletonUnitName}, '_id' is not specified`;
      }
      this.units[singletonUnitName] = {
        _id: id
      };
    } else {
      if (required) {
        throw `Singleton Unit ${singletonUnitName} is required and is not specified`;
      }
    }

    return exists;
  }

  private resolve<E extends Entity>():Promise<E> {
    if (this.iEntity._rev) {
      return Promise.resolve(this.iEntity);
    }

    let promise = new Promise((
      resolve,
      reject
    ) => {
      this.getRepository().get(this.iEntity._id).then((
        iEntity:IE
      ) => {
        this.iEntity = iEntity;
        resolve(this);
      }).catch(( error ) => {
        reject(error);
      })
    });

    return promise;
  }

  protected getUnitArray<IU extends IEntity, U extends Entity>(
    unitName:string,
    UnitClass:U
  ):Promise<U[]> {
    if (this.units[unitName]) {
      return Promise.resolve(this.units[unitName]);
    }

    this.units[unitName] = [];
    let iUnits:IU[] = this.iEntity.units[unitName];
    if (!iUnits || iUnits.length === 0) {
      return Promise.resolve(this.units[unitName]);
    }

    iUnits.forEach(( iUnit:IU ) => {
      let unit = new UnitClass(iUnit, UnitClass);
      this.units[unitName].push(unit);
      if (this.maintainArrayUnitsMaps) {
        this.unitArrayMaps[unitName] = unit;
      }
    });

    return Entity.resolveMany(this.units[unitName]);
  }

  protected getSingletonUnit<U extends Entity>(
    unitName:string,
    UnitClass:U
  ):Promise<U> {
    if (this.units[unitName]) {
      return Promise.resole(this.units[unitName]);
    }

    if (!this.iEntity.units[unitName]) {
      return Promise.resole(null);
    }

    this.units[unitName] = new UnitClass(this.iEntity.units[unitName]);
    return this.units[unitName].resolve(repository);
  }

  protected setSingletonUnit<E extends Entity, U extends Entity>(
    unitName:string,
    unit:U
  ):Promise<E> {
    this.units[unitName] = unit;

    this.iEntity.units[unitName] = {
      _id: unit.iEntity._id
    };

    return this.save();
  }

  protected addToUnitArray<E extends Entity, U extends Entity>(
    unitName:string,
    unit:U,
    UnitClass:U
  ):Promise<E> {
    if (!this.units[unitName]) {
      return this.getUnitArray(unitName, UnitClass).then((
        unitArray:U[]
      ) => {
        return this.addToUnitArrayInternal(unitName, unit);
      });
    }
    return this.addToUnitArrayInternal(unitName, unit);
  }

  private addToUnitArrayInternal<E extends Entity, U extends Entity>(
    unitName:string,
    unit:U
  ):Promise<E> {
    this.units[unitName].push(unit);
    this.iEntity.units[unitName].push({
      _id: unit.iEntity._id
    });
    if (this.maintainArrayUnitsMaps) {
      this.unitArrayMaps[unitName] = unit;
    }

    unit.save().then(()=> {
      return this;
    });
  }

  save():Promise<IE> {
    return this.getRepository().save(this.iEntity);
  }

}


export abstract class LabeledEntity <IE extends IEntity, IEU extends IEntityUnits, R extends CachedRepository> extends Entity<IE, IEU, R> {

  static createILabeledEntity<ILE extends ILabeledEntity>(
    name:string,
    type:EntityType
  ):ILE {
    let iLabeledEntity:ILE = CoreEntity.createIEntity(name, type);

    return iLabeledEntity;
  }

  constructor(
    iLabeledEntity:ILabeledEntity
  ) {
    super(iLabeledEntity);

    this.initUnitArray('labels', {});
  }

}
