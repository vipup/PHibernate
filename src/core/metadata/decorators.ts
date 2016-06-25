/**
 * Created by Papa on 4/17/2016.
 */

import {DSLParser} from "../query/DSLParser";
import {
	IQEntity, IQRelation, QEntity, QRelation,
	RelationType, IEntity, QStringField, QNumberField, QDateField, IQStringField,
	IQNumberField, IQDateField, IDateOperation, IStringOperation, INumberOperation, JSONStringOperation,
	JSONNumberOperation, JSONDateOperation
} from "querydsl-typescript/lib/index";
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
 * Annotates collections of Entities in other entities.
 *
 * @param foreignKeyFieldName
 * @returns {function(any, string)}
 * @constructor
 */
export function ForeignKey(
	foreignKeyFieldName:string
) {
	return function (
		targetObject:any,
		propertyKey:string
	) {

	}
}

export function MappedBy(
	collectionFieldName:string
) {
	return function (
		targetObject:any,
		propertyKey:string
	) {

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
 * @param queryDefinition
 * @returns {function(any, string)}
 * @constructor
 */
export function Query<IE extends IEntity, IParams>(
	entityClass:any,
	queryDefinition:IE | {(q, params:IParams):IE},
  paramsFactory:{():IParams}
) {

	return function (
		targetObject:any,
		propertyKey:string
	) {
	}

}

let goal:IGoal = {
};


export class Task {

	description:string;
	taskId:number;
	name:string;
	goal:Goal;
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
	goal = new QRelation<QGoal, Goal, QTask>(this, QTask, RelationType.MANY_TO_ONE, 'goalId', Goal, QGoal);
	prerequisiteTasks = new QRelation<QTask, Task, QTask>(this, QTask, RelationType.ONE_TO_MANY, 'nextTaskId', Task, QTask);

	constructor(
		isTemplate:boolean = false
	) {
		super(Task, 'Task', isTemplate);
	}

	toJSON():any {
		throw 'Not Implemented';
	}

}

export class Goal {
	description:string;
	goalId:number;
	name:string;
	dueDate:Date;
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
	tasks = new QRelation<QTask, Task, QGoal>(this, QGoal, RelationType.ONE_TO_MANY, 'goal', Task, QTask);

	constructor(
		isTemplate:boolean = false
	) {
		super(Goal, 'Goal', isTemplate);
	}

	toJSON():any {
		throw 'Not Implemented';
	}

}
