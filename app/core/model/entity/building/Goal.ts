import {
  EntityName, EntityType, ILabeledEntity, ILabeledEntityUnits, LabeledEntity,
  OneToManyRelations
} from "../Entity";
import {GoalRepository} from "../../../repository/building/GoalRepository";
import {REPOES} from "../../../repository/Repositories";
import {IPerson} from "../personnel/Person";
/**
 * Created by Papa on 3/16/2016.
 */

export interface IGoal<IE extends IGoal> extends ILabeledEntity{
  current:IGoalSnapshot;
  history:IGoalSnapshot[];
  oneToMany: {
    Task:IOneToManyRelation<Task, IE>;
  }
}

export interface IGoalSnapshot {
  curator:IPerson;
  date:Date;
  description:string;
  editor:IPerson;
  labels:ILabel[];
  summary:string;
}

export class Goal extends CoreGoal {

}

export class CoreGoal extends LabeledEntity<IGoal, GoalRepository> {

  static createIGoal(
    rate:number,
    units:IGoalUnits[]
  ):IGoal {
    let iGoal:IGoal = LabeledEntity.createILabeledEntity(EntityName.GOAL, EntityType.GOAL);
    iGoal.rate = rate;

    return iGoal;
  }

  constructor(
    iGoal:IGoal
  ) {
    super(iGoal);
  }

  getRepository():GoalRepository {
    return REPOES.GoalRepository;
  };

}
