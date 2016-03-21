import {OneToManyRelations} from "./";
/**
 * Created by Papa on 3/17/2016.
 */

export interface ISelfRelations {
  [propertyName:string]:any;
}

export interface IManyToOneRelation<RE extends Entity, E extends IEntity> {
  get():Promise<IRE>
  set( relationEntity:IRE ):Promise<IE>;
}

export interface IManyToOneRelations {
  [relationName:string]:ManyToOneRelation;
}

export interface IOneToManyRelation<RE extends Entity, E extends Entity> {
  get:{
    all():Promise<RE[]>;
    active():Promise<RE[]>;
  }
  add( relationEntity:RE ):Promise<E>;
}

export interface IOneToManyRelations {
  [relationName:string]:IOneToManyRelation;
}

export interface IEntitySetRelationMaps {
  [setName:string]:{[_id:string]:IEntity};
}

export interface IEntityRelationMap {
  [entityName:string]:IEntity;
}

export class SelfRelations implements ISelfRelations {

  init(
    i
  )

// FIXME: periodically check the build in TypeScript generation of getters and make sure
// that this implementation still matches.
  initProperty<Us extends IEntityUnits>(
    singletonUnitName:string
  ):boolean {
    // this.constructorFunction
    Object.defineProperty(this.entity.constructor.prototype, singletonUnitName, {
      get: function () {
        return this.entity.iEntity[singletonUnitName];
        // return this.entity.getSingletonUnit(singletonUnitName, UnitClass);
      },
      set: function ( singletonUnit ) {
        this.entity.iEntity[singletonUnitName] = singletonUnit;
        return this;
      },
      enumerable: true,
      configurable: true
    });
  }
}

export class OneToManyRelations implements OneToManyRelations {


// FIXME: periodically check the build in TypeScript generation of functions and make sure
// that this implementation still matches.
  initOneToManyRelation<IE extends IEntity, Us extends IEntityUnits, U extends Entity>(
    UnitClass:U,
    unitArrayName:string,
    units:Us,
    required:boolean = false
  ):boolean {

  }
}


// FIXME: periodically check the build in TypeScript generation of functions and make sure
// that this implementation still matches.
initManyToOneRelation<IE extends IEntity, Us extends IEntityUnits, U extends Entity>(
  UnitClass:U,
  unitArrayName:string,
  units:Us,
  required:boolean = false
):boolean {

}
