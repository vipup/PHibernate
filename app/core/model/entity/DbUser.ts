import {IEntity, Entity} from "./Entity";
import {getCurrentQueriableTimeStamp} from "../util/Dates";
/**
 * Created by Papa on 3/17/2016.
 */

var currentUserId:number;
var defaultUserName = 'system';
var defaultUserPrefix = 'DbUser';

function getNewUserId(
  userName:string = getNewUserName(),
  userPrefix:string = defaultUserPrefix
):DbUser {
  let timestamp = getCurrentQueriableTimeStamp();
  let systemUserId = `${userPrefix}_${userName}_${timestamp}`;
}

function getNewUserName(
  userName:string = defaultUserName
):string {
  if (!currentUserId) {
    currentUserId = 0;
  }
  currentUserId++;
  let userName = `${userName}_${currentUserId}`

  return userName;
}

function getNewUserJson():IDbUser {
  let userName = getNewUserName();
  let newUserId = getNewUserId(userName);
  let iDbUser:IDbUser = {
    _id: newUserId,
    userName: userName,
    passwordHash: 'Password1',
    order: currentUserId
  };

  return iDbUser;
}

function getNewUser():DbUser {
  let iDbUser:IDbUser = getNewUserJson();
  let dbUser:DbUser = new DbUser(iDbUser);

  return dbUser;
}

export interface IDbUser extends IEntity {
  userName:string;
  passwordHash:string;
  order:number;
}

export class DbUser<DU extends DbUser> extends Entity {

  static currentSystemUser:DU;

  static getCurrentSystemUser():DU {
    if (this.currentSystemUser) {
      return this.currentSystemUser;
    }
    this.currentSystemUser = new DbUser({});
  }

  static setCurrentSystemUser<DU extends DbUser>(
    dbUser:DU
  ) {
    this.currentSystemUser = dbUser;
  }

  order:number;

  constructor(
    iDbUser:IDbUser
  ) {
    super(iDbUser);
  }
}
