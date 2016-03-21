///<reference path="../imports.ts"/>
import {IDbObject, IDbUpdateRecord, IDbError} from "../model/db/DbObject";
import {getStartOfDayDate, getCurrentDateTimestamp} from "../model/util/Dates";
/**
 * Created by artem on 6/26/15.
 */

export interface IObjectMap<DBO extends IDbObject> {
  [id:string]:DBO;
}

export class CachedRepository<DBO extends IDbObject> {

  protected objects:DBO[];
  protected mapById:IObjectMap<DBO>;
  protected db;

  constructor
  (
    protected $ionicPopup,
    private idPrefix:string,
    pouchDB
  ) {
    this.db = pouchDB('bos');
  }

  setObjects( objects:DBO[] ) {
    this.objects = objects;
    this.mapById = {};
    this.objects.forEach(( object:DBO )=> {
      this.mapById[object._id] = object;
    });
  }

  get( id:string ):Promise<DBO> {
    return new Promise(( resolve )=> {
      this.getAsync(id, resolve);
    });
  }

  protected getAsync
  (
    id:string,
    callback:( object:DBO ) => void
  ):void {
    if (!this.mapById) {
      setTimeout(()=> {
        this.getAsync(id, callback);
      }, 300);
    } else {
      callback(this.mapById[id]);
    }
  }

  getAll():Promise<DBO[]> {
    return new Promise(( resolve )=> {
      this.getAllAsync(resolve);
    });
  }

  getMap():Promise<IObjectMap<DBO>> {
    return this.getAll().then(()=> {
      return this.mapById;
    });
  }

  protected getAllAsync( callback:( objects:DBO[] )=>void ) {
    if (this.objects) {
      callback(this.objects);
    } else {
      setTimeout(()=> {
        this.getAllAsync(callback);
      }, 300);
    }
  }

  // FIXME: prototype code, use proper PouchDB interface for this
  getAllByIds( objectIds:string[] ):Promise<DBO[]> {
    return this.getAll().then(()=> {
      var objects:DBO[] = [];
      if (objectIds) {
        objectIds.forEach(( objectId:string )=> {
          objects.push(this.mapById[objectId]);
        });
      }

      return objects;
    })

  }

  //protected getAllByIdsAsync(callback:(objects:DBO[])=> {})

  protected preSave(
    object:DBO,
    today:Date
  ) {
  }

  save
  ( object:DBO ):Promise<DBO> {
    return new Promise<DBO>(( resolve )=> {
      var today = getStartOfDayDate();
      this.preSave(object, today);
      object.createdDate = today;
      object._id = this.idPrefix + getCurrentDateTimestamp();
      this.db.put(object)
        .then(( record:IDbUpdateRecord )=> {
          object._rev = record.rev;
          resolve(object);
        }).catch(( errors:IDbError )=> {
        this.$ionicPopup.alert({
          title: 'Database Error',
          template: 'Error creating an object.'
        });
      });
      object.cacheIndex = this.objects.length;
      this.mapById[object._id] = object;
      this.objects.push(object);
    })
  }

  update(
    object:DBO
  ):Promise<DBO> {
    return new Promise<DBO>(( resolve )=> {
      object.updatedDate = getStartOfDayDate();
      this.db.put(object)
        .then(( record:IDbUpdateRecord )=> {
          object._rev = record.rev;
          resolve(object);
        }).catch(( errors:IDbError )=> {
        this.$ionicPopup.alert({
          title: 'Database Error',
          template: 'Error updating an object.'
        });
      });
    });
  }
}
