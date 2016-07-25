/**
 * Created by Papa on 4/17/2016.
 */
import { IQEntity, IQRelation, QEntity, QRelation, IEntity, QStringField, QNumberField, QDateField, IQStringField, IQNumberField, IQDateField, IDateOperation, IStringOperation, INumberOperation, JSONStringOperation, JSONNumberOperation, JSONDateOperation } from "querydsl-typescript/lib/index";
import { PH } from "../../config/PH";
import { ManyToOneElements, OneToManyElements } from "../../config/JPAApi";
export declare const PH_PRIMARY_KEY: string;
export declare const PH_MANY_TO_ONE: string;
export declare const PH_ONE_TO_MANY: string;
/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
export declare function Id(): (targetObject: any, propertyKey: string) => void;
export interface EntityConfiguration {
}
/**
 * Annotates entities.
 *
 * @param entityConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function Entity(entityConfiguration?: EntityConfiguration): (constructor: Function) => void;
/**
 * Specifies a single-valued association to another entity class that has many-to-one multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/ManyToOne.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export declare function ManyToOne(elements?: ManyToOneElements): (targetObject: any, propertyKey: string) => void;
/**
 * Specifies a many-valued association with one-to-many multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export declare function OneToMany(elements?: OneToManyElements): (targetObject: any, propertyKey: string) => void;
export interface RepositoryConfiguration {
}
export declare function Repository(repositoryConfiguration?: RepositoryConfiguration): (constructor: Function) => void;
/**
 * Annotates query function pointers (variables).
 *
 * @param selectDefinition
 * @param fromWhereDefinition
 * @returns {function(any, string)}
 * @constructor
 */
export declare function Query<IE extends IEntity, IParams>(entityClass: any, selectDefinition: IE | {
    (select: any): IE;
}, fromWhereDefinition: IE | {
    (q: PH, params: IParams): IE;
}, paramsFactory: {
    (): IParams;
}): (target: any, propertyKey: string) => void;
export declare class Task {
    description: string;
    goal: Goal;
    taskId: number;
    name: string;
    nextTaskId: number;
    prerequisiteTasks: Task[];
}
export interface ITask extends IEntity {
    description?: IQStringField<any> | IStringOperation | JSONStringOperation | string;
    taskId?: IQNumberField<any> | INumberOperation | JSONNumberOperation | number;
    name?: IQStringField<any> | IStringOperation | JSONStringOperation | string;
    goal?: IQRelation<IQGoal, Goal, IQTask> | IQGoal;
    prerequisiteTasks?: IQRelation<IQTask, Task, IQTask> | IQTask;
}
export interface IQTask extends ITask, IQEntity {
}
export declare class QTask extends QEntity<QTask> implements IQTask {
    static q: QTask;
    static description: QStringField<QTask>;
    static taskId: QNumberField<QTask>;
    static name: QStringField<QTask>;
    static goal: QRelation<QGoal, Goal, QTask>;
    static prerequisiteTasks: QRelation<QTask, Task, QTask>;
    description: QStringField<QTask>;
    taskId: QNumberField<QTask>;
    name: QStringField<QTask>;
    goal: QRelation<QGoal, Goal, QTask>;
    prerequisiteTasks: QRelation<QTask, Task, QTask>;
    constructor(isTemplate?: boolean);
    toJSON(): any;
}
export declare class Goal {
    description: string;
    goalId: number;
    name: string;
    dueDate: Date;
    tasks: Task[];
}
export interface IGoal extends IEntity {
    description?: IQStringField<any> | IStringOperation | JSONStringOperation | string;
    goalId?: IQNumberField<any> | INumberOperation | JSONNumberOperation | number;
    name?: IQStringField<any> | IStringOperation | JSONStringOperation | string;
    dueDate?: IQDateField<any> | IDateOperation | JSONDateOperation | Date;
    tasks?: IQRelation<IQTask, Task, IQGoal> | IQTask;
}
export interface IQGoal extends IGoal, IQEntity {
}
export declare class QGoal extends QEntity<QGoal> implements IQGoal {
    static q: QGoal;
    static description: QStringField<QGoal>;
    static goalId: QNumberField<QGoal>;
    static name: QStringField<QGoal>;
    static dueDate: QDateField<QGoal>;
    static tasks: QRelation<QTask, Task, QGoal>;
    description: QStringField<QGoal>;
    goalId: QNumberField<QGoal>;
    name: QStringField<QGoal>;
    dueDate: QDateField<QGoal>;
    tasks: QRelation<QTask, Task, QGoal>;
    constructor(isTemplate?: boolean);
    toJSON(): any;
}
