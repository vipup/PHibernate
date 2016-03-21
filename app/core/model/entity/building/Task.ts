import {EntityName, EntityType, ILabeledEntity, ILabeledEntityUnits, LabeledEntity} from "../Entity";
import {TaskRepository} from "../../../repository/building/TaskRepository";
import {REPOES} from "../../../repository/Repositories";
import {IReturns, Returns} from "../funds/Returns";
import reflection from "../../util/Reflection";
/**
 * Created by Papa on 3/16/2016.
 */

export interface ITask extends ILabeledEntity {
  rate:number;
  manyToOne:{
    story:ManyToOneRelation<Task, IReturns>;
  };
  oneToMany:{
    returns:OneToManyRelation<ITask, IReturns>;
  };
}

export function createITask(
  rate?:number,
  manyToOne?:ManyToOneRelations,
  oneToMany?:OneToManyRelations
):ITask {
  return {
    rate: null,
    manyToOne: {
      story: manyToOne ? manyToOne.story : null
    },
    oneToMany: {
      returns: oneToMany ? oneToMany.returns : null
    }
  }
}

export function createTask(
  iTask:ITask,
):ITask {
  let iTask:ITask = LabeledEntity.createILabeledEntity(EntityName.Task, EntityType.Task);
  iTask.rate = rate;

  console.log(reflection.getFunctionParamNames(this.createTask));

  let task = new Task(iTask);

  return task;
}


class CoreTask extends LabeledEntity<ITask, ITaskUnits, TaskRepository> implements ITask {

  constructor(
    iTask:ITask
  ) {
    super(iTask);
    this.units = new CoreTaskUnits(this);
  }

  getRepository():TaskRepository {
    return REPOES.TaskRepository;
  };

  get rate() {
    return this.iEntity.rate;
  }

  set rate(
    rate:number
  ):ITask {
    this.iEntity.rate = rate;
    return this;
  }

}

class CoreTaskUnits implements ITaskUnits {

  constructor(
    private coreTask:CoreTask
  ) {
  }

  getReturns():Promise<Returns> {
    return this.coreTask.getSingletonUnit('returns', Returns);
  }

  setReturns(
    returns:Returns
  ):Promse<ITask> {
    return this.coreTask.setSingletonUnit('returns', Returns);
  }

  getReturnsArray():Promise<Returns[]> {
    return this.coreTask.getUnitArray('returnsArray', Returns);
  }

  addToReturnsArray(
    returns:Person
  ):Promise<ITask> {
    return this.coreTask.addToUnitArray('returnsArray', returns, Returns);
  }

}

class Task extends CoreTask {

}
