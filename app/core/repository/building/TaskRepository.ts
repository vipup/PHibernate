import {CachedRepository} from "../CachedRepository";
import {ITask} from "../../model/entity/building/Task";
/**
 * Created by Papa on 3/16/2016.
 */

@Injectable()
export class TaskRepository extends EntityRepository<ITask> {
  constructor() {
    super('task', Task);
  }
}
