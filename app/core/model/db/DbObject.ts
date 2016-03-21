/**
 * Created by Papa on 3/14/2016.
 */

export interface IDbObjectClass {
  _type:string;
}

export interface IDbObject {
  _id:string;
  _rev?:string;
  _type:string;
}

export class DbObject implements IDbObject {
  _id:string;
  _rev:string;
}

export interface IDbUpdateRecord {
  ok:boolean;
  id:string;
  rev:string;
}

export interface IDbError {
  status:number;
  name:string;
  message:string;
  error:boolean;
}
