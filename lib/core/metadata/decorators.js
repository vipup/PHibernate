/**
 * Created by Papa on 4/17/2016.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const index_1 = require("querydsl-typescript/lib/index");
const PH_1 = require("../../config/PH");
exports.PH_PRIMARY_KEY = '__primaryKey__';
exports.PH_MANY_TO_ONE = '__ph_many_to_one__';
exports.PH_ONE_TO_MANY = '__ph_one_to_many__';
/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
function Id() {
    return function (targetObject, propertyKey) {
        if (targetObject[exports.PH_PRIMARY_KEY]) {
            throw `Cannot set primary key to '${propertyKey}', it is already set to '${targetObject[exports.PH_PRIMARY_KEY]}'`;
        }
        targetObject[exports.PH_PRIMARY_KEY] = propertyKey;
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
 * Specifies a single-valued association to another entity class that has many-to-one multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/ManyToOne.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
function ManyToOne(elements) {
    return function (targetObject, propertyKey) {
        let manyToOne = targetObject[exports.PH_MANY_TO_ONE];
        if (!manyToOne) {
            manyToOne = {};
            targetObject[exports.PH_MANY_TO_ONE] = manyToOne;
        }
        manyToOne[propertyKey] = elements;
    };
}
exports.ManyToOne = ManyToOne;
/**
 * Specifies a many-valued association with one-to-many multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
function OneToMany(elements) {
    return function (targetObject, propertyKey) {
        let oneToMany = targetObject[exports.PH_ONE_TO_MANY];
        if (!oneToMany) {
            oneToMany = {};
            targetObject[exports.PH_ONE_TO_MANY] = oneToMany;
        }
        oneToMany[propertyKey] = elements;
    };
}
exports.OneToMany = OneToMany;
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
    return function (target, propertyKey) {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                throw `Not implemented yet`;
            },
            set: function (val) {
                throw `Cannot override '${propertyKey}' @Query annotated reference, please define a parameter function.`;
            }
        });
    };
}
exports.Query = Query;
let goal = {};
class Task {
}
__decorate([
    ManyToOne(), 
    __metadata('design:type', Goal)
], Task.prototype, "goal", void 0);
__decorate([
    Id(), 
    __metadata('design:type', Number)
], Task.prototype, "taskId", void 0);
__decorate([
    OneToMany(), 
    __metadata('design:type', Array)
], Task.prototype, "prerequisiteTasks", void 0);
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
        this.goal = new index_1.QRelation(this, QTask, index_1.RelationType.MANY_TO_ONE, 'goal', Goal, QGoal);
        this.prerequisiteTasks = new index_1.QRelation(this, QTask, index_1.RelationType.ONE_TO_MANY, 'prerequisiteTasks', Task, QTask);
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
PH_1.PH.addQEntity(Task, QTask.q);
class Goal {
}
__decorate([
    OneToMany(), 
    __metadata('design:type', Array)
], Goal.prototype, "tasks", void 0);
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
        this.tasks = new index_1.QRelation(this, QGoal, index_1.RelationType.ONE_TO_MANY, 'tasks', Task, QTask);
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
PH_1.PH.addQEntity(Goal, QGoal.q);
//# sourceMappingURL=decorators.js.map