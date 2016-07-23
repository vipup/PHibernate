/**
 * Created by Papa on 4/17/2016.
 */

import {
	IQEntity, IQRelation, QEntity, QRelation,
	RelationType, IEntity, QStringField, QNumberField, QDateField, IQStringField,
	IQNumberField, IQDateField, IDateOperation, IStringOperation, INumberOperation, JSONStringOperation,
	JSONNumberOperation, JSONDateOperation
} from "querydsl-typescript/lib/index";
import {PH} from "../../config/PH";
import {ManyToOneElements, OneToManyElements} from "../../config/JPAApi";

export const PH_PRIMARY_KEY = '__primaryKey__';
export const PH_MANY_TO_ONE = '__ph_many_to_one__';
export const PH_ONE_TO_MANY = '__ph_one_to_many__';


/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
export function Id() {
	return function (
		targetObject:any,
		propertyKey:string
	) {
		if(targetObject[PH_PRIMARY_KEY]) {
			throw `Cannot set primary key to '${propertyKey}', it is already set to '${targetObject[PH_PRIMARY_KEY]}'`;
		}
		targetObject[PH_PRIMARY_KEY] = propertyKey;
	}
}

export interface EntityConfiguration {

}

/**
 * Annotates entities.
 *
 * @param entityConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function Entity(
	entityConfiguration?:EntityConfiguration
) {
	return function (
		constructor:Function
	) {
	}
}

/**
 * Specifies a single-valued association to another entity class that has many-to-one multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/ManyToOne.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export function ManyToOne(
	elements?:ManyToOneElements
) {
	return function (
		targetObject:any,
		propertyKey:string
	) {
		let manyToOne = targetObject[PH_MANY_TO_ONE];
		if(!manyToOne) {
			manyToOne = {};
			targetObject[PH_MANY_TO_ONE] = manyToOne;
		}
		manyToOne[propertyKey] = elements;
	}

}

/**
 * Specifies a many-valued association with one-to-many multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export function OneToMany(
	elements?:OneToManyElements
) {
	return function (
		targetObject:any,
		propertyKey:string
	) {
		let oneToMany = targetObject[PH_ONE_TO_MANY];
		if(!oneToMany) {
			oneToMany = {};
			targetObject[PH_ONE_TO_MANY] = oneToMany;
		}
		oneToMany[propertyKey] = elements;
	}

}

export interface RepositoryConfiguration {

}

export function Repository(
	repositoryConfiguration?:RepositoryConfiguration
) {

	return function (constructor:Function) {
	}

}

/**
 * Annotates query function pointers (variables).
 *
 * @param selectDefinition
 * @param fromWhereDefinition
 * @returns {function(any, string)}
 * @constructor
 */
export function Query<IE extends IEntity, IParams>(
	entityClass:any,
	selectDefinition:IE | {(select:any):IE},
	fromWhereDefinition:IE | {(q:PH, params:IParams):IE},
  paramsFactory:{():IParams}
) {

	return function (target, propertyKey:string) {
		Object.defineProperty(target, propertyKey, {
			get: function () {
				throw `Not implemented yet`;
			},
			set: function (val) {
			throw `Cannot override '${propertyKey}' @Query annotated reference, please define a parameter function.`;
			}
		});
	}

}

let goal:IGoal = {
};


export class Task {

	description:string;

	@ManyToOne()
	goal:Goal;

	@Id()
	taskId:number;

	name:string;

	nextTaskId:number;

	@OneToMany()
	prerequisiteTasks:Task[];

}

//Entity Query
export interface ITask
extends IEntity
{
	// Properties
	description?: IQStringField<any> | IStringOperation | JSONStringOperation | string;
	taskId?: IQNumberField<any> | INumberOperation | JSONNumberOperation | number;
	name?: IQStringField<any> | IStringOperation | JSONStringOperation | string;

	// Relations
	goal?: IQRelation<IQGoal, Goal, IQTask> | IQGoal
	prerequisiteTasks?: IQRelation<IQTask, Task, IQTask> | IQTask

}

export interface IQTask
extends ITask, IQEntity {
}

// Entity Query Implementation
export class QTask
extends QEntity<QTask> implements IQTask
{
	static q = new QTask(true);

	// Static Field accessors
	static description = QTask.q.description;
	static taskId = QTask.q.taskId;
	static name = QTask.q.name;

	// Static Relation accessors
	static goal = QTask.q.goal;
	static prerequisiteTasks = QTask.q.prerequisiteTasks;

	// Fields
	description = new QStringField<QTask>(this, QTask, 'Task', 'description');
	taskId = new QNumberField<QTask>(this, QTask, 'Task', 'taskId');
	name = new QStringField<QTask>(this, QTask, 'Task', 'name');

	// Relations
	goal = new QRelation<QGoal, Goal, QTask>(this, QTask, RelationType.MANY_TO_ONE, 'goal', Goal, QGoal);
	prerequisiteTasks = new QRelation<QTask, Task, QTask>(this, QTask, RelationType.ONE_TO_MANY, 'prerequisiteTasks', Task, QTask);

	constructor(
		isTemplate:boolean = false
	) {
		super(Task, 'Task', isTemplate);
	}

	toJSON():any {
		throw 'Not Implemented';
	}

}

PH.addQEntity(Task, QTask.q);

export class Goal {
	description:string;
	goalId:number;
	name:string;
	dueDate:Date;

	@OneToMany()
	tasks:Task[];
}

//Entity Query
export interface IGoal
extends IEntity
{
	// Properties
	description?: IQStringField<any> | IStringOperation | JSONStringOperation | string;
	goalId?: IQNumberField<any> | INumberOperation | JSONNumberOperation | number;
	name?: IQStringField<any> | IStringOperation | JSONStringOperation | string;
	dueDate?: IQDateField<any> | IDateOperation | JSONDateOperation | Date;

	// Relations
	tasks?: IQRelation<IQTask, Task, IQGoal> | IQTask

}

export interface IQGoal
extends IGoal, IQEntity {
}

// Entity Query Implementation
export class QGoal
extends QEntity<QGoal> implements IQGoal
{
	static q = new QGoal(true);

	// Static Field accessors
	static description = QGoal.q.description;
	static goalId = QGoal.q.goalId;
	static name = QGoal.q.name;
	static dueDate = QGoal.q.dueDate;

	// Static Relation accessors
	static tasks = QGoal.q.tasks;

	// Fields
	description = new QStringField<QGoal>(this, QGoal, 'Goal', 'description');
	goalId = new QNumberField<QGoal>(this, QGoal, 'Goal', 'goalId');
	name = new QStringField<QGoal>(this, QGoal, 'Goal', 'name');
	dueDate = new QDateField<QGoal>(this, QGoal, 'Goal', 'dueDate');

	// Relations
	tasks = new QRelation<QTask, Task, QGoal>(this, QGoal, RelationType.ONE_TO_MANY, 'tasks', Task, QTask);

	constructor(
		isTemplate:boolean = false
	) {
		super(Goal, 'Goal', isTemplate);
	}

	toJSON():any {
		throw 'Not Implemented';
	}

}

PH.addQEntity(Goal, QGoal.q);
