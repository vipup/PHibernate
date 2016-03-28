import {Entity} from "./core/Entity";
/**
 * Created by Papa on 3/26/2016.
 */

export class Task extends Entity {

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