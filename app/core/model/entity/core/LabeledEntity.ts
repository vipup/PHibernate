import {IEntity, Entity} from "../Entity";
/**
 * Created by Papa on 3/17/2016.
 */

export interface ILabeledEntity extends IEntity {
  LabelSet:IOneToManyRelation;
}

export class LabeledEntity extends Entity<ILabeledEntity> {


  labels:ILabel[];
  
}
