/**
 * Created by Papa on 3/26/2016.
 */
import {Entity as AbstractEntity} from "./core/Entity";
import {Entity} from './core/entityDecorators';

@Entity
export class Task extends AbstractEntity {

	/**
	 * The other tasks
	 * And then some!
	 */
	otherTasks:Task[];

	testTasks(
		moreTasks:Task[]
	):void {
		if(!this.otherTasks) {
			this.otherTasks = [];
		}
		this.otherTasks = this.otherTasks.concat(moreTasks);
	}


}