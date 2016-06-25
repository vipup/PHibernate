/**
 * Created by Papa on 4/17/2016.
 */
"use strict";
const index_1 = require("querydsl-typescript/lib/index");
/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
function Id() {
    return function (targetObject, propertyKey) {
    };
}
exports.Id = Id;
/**
 * Annotates entities.
 *
 * @param entityConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Entity(entityConfiguration) {
    return function (constructor) {
    };
}
exports.Entity = Entity;
/**
 * Annotates collections of Entities in other entities.
 *
 * @param foreignKeyFieldName
 * @returns {function(any, string)}
 * @constructor
 */
function ForeignKey(foreignKeyFieldName) {
    return function (targetObject, propertyKey) {
    };
}
exports.ForeignKey = ForeignKey;
function MappedBy(collectionFieldName) {
    return function (targetObject, propertyKey) {
    };
}
exports.MappedBy = MappedBy;
function Repository(repositoryConfiguration) {
    return function (constructor) {
    };
}
exports.Repository = Repository;
/**
 * Annotates query function pointers (variables).
 *
 * @param queryDefinition
 * @returns {function(any, string)}
 * @constructor
 */
function Query(entityClass, queryDefinition, paramsFactory) {
    return function (targetObject, propertyKey) {
    };
}
exports.Query = Query;
let goal = {};
class Task {
}
exports.Task = Task;
// Entity Query Implementation
class QTask extends index_1.QEntity {
    constructor(isTemplate = false) {
        super(Task, 'Task', isTemplate);
        // Fields
        this.description = new index_1.QStringField(this, QTask, 'Task', 'description');
        this.taskId = new index_1.QNumberField(this, QTask, 'Task', 'taskId');
        this.name = new index_1.QStringField(this, QTask, 'Task', 'name');
        // Relations
        this.goal = new index_1.QRelation(this, QTask, index_1.RelationType.MANY_TO_ONE, 'goalId', Goal, QGoal);
        this.prerequisiteTasks = new index_1.QRelation(this, QTask, index_1.RelationType.ONE_TO_MANY, 'nextTaskId', Task, QTask);
    }
    toJSON() {
        throw 'Not Implemented';
    }
}
QTask.q = new QTask(true);
// Static Field accessors
QTask.description = QTask.q.description;
QTask.taskId = QTask.q.taskId;
QTask.name = QTask.q.name;
// Static Relation accessors
QTask.goal = QTask.q.goal;
QTask.prerequisiteTasks = QTask.q.prerequisiteTasks;
exports.QTask = QTask;
class Goal {
}
exports.Goal = Goal;
// Entity Query Implementation
class QGoal extends index_1.QEntity {
    constructor(isTemplate = false) {
        super(Goal, 'Goal', isTemplate);
        // Fields
        this.description = new index_1.QStringField(this, QGoal, 'Goal', 'description');
        this.goalId = new index_1.QNumberField(this, QGoal, 'Goal', 'goalId');
        this.name = new index_1.QStringField(this, QGoal, 'Goal', 'name');
        this.dueDate = new index_1.QDateField(this, QGoal, 'Goal', 'dueDate');
        // Relations
        this.tasks = new index_1.QRelation(this, QGoal, index_1.RelationType.ONE_TO_MANY, 'goal', Task, QTask);
    }
    toJSON() {
        throw 'Not Implemented';
    }
}
QGoal.q = new QGoal(true);
// Static Field accessors
QGoal.description = QGoal.q.description;
QGoal.goalId = QGoal.q.goalId;
QGoal.name = QGoal.q.name;
QGoal.dueDate = QGoal.q.dueDate;
// Static Relation accessors
QGoal.tasks = QGoal.q.tasks;
exports.QGoal = QGoal;
//# sourceMappingURL=decorators.js.map