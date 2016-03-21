import {CachedRepository} from "../CachedRepository";
import {IGoal} from "../../model/entity/building/Goal";
import {EntityRepository} from "../../entity/cache/repository/EntityRepository";
/**
 * Created by Papa on 3/16/2016.
 */

export class GoalRepository<IG extends IGoal, G extends Goal> extends EntityRepository<IG, G> {


  createIEntity(
    iEpic:IG
  ):IG {
    let iGoal = super.createIEntity();
    iEpic.rate = rate;

    return iGoal;
  }


  createEntity(
    iGoal:IG
  ):G {
    let goal = super.createIEntity({
      current: {
        curator: null,
        date: null,
        description: null,
        editor: null,
        labels: null,
        summary: null
      },
      history: [],
      oneToMany: {
        Task: null
      }
    });

    let epic:Epic = new Goal(iGoal);

    return iGoal;
  }
}
