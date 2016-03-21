import {EntityName, EntityType, Entity, ILabeledEntity, ILabeledEntityUnits, LabeledEntity} from "../Entity";
import {LabelRepository} from "../../../repository/core/LabelRepository";
import {Area, IArea} from "../company/Area";
import {IGoal} from "../building/Goal";
import {ITask} from "../building/Task";
import {IContribution} from "../funds/Contribution";
import {IExpense} from "../funds/Expense";
import {IFund} from "../funds/Fund";
import {ICompany} from "../company/Company";
import {IOrganization} from "../funds/Organization";
import {IPerson} from "../personnel/Person";
import {IPersonRole} from "../personnel/PersonRole";
import {IRole} from "../personnel/Role";
import {ITimeEntry} from "../time/TimeEntry";
/**
 * Created by Papa on 3/16/2016.
 */

export interface ILabel extends ILabeledEntity {
  name:string;
  units:ILabelUnits;
}

export interface ILabelUnits<IE extends IEntity> extends ILabeledEntityUnits {
  areas:IArea[];
  companies:ICompany[];
  contributions:IContribution[];
  entities:IE[];
  expenses:IExpense[];
  funds:IFund[];
  goals:IGoal[];
  organizations:IOrganization[];
  people:IPerson[];
  personRoles:IPersonRole[];
  roles:IRole[];
  returns:IReturns[];
  tasks:ITask[];
  timeEntries:ITimeEntry[];
}

export class Label extends CoreLabel {

  static createLabel(
    name:string,
    units:ILabelUnits[]
  ):Label {
    let iLabel:ILabel = Entity.createIEntity(EntityName.LABEL, EntityType.LABEL);
    iLabel.name = name;

    let label:Label = new Label(iLabel);

    label.initUnitArray('areas', units);
    label.initUnitArray('companies', units);
    label.initUnitArray('contributions', units);
    label.initUnitArray('entities', units);
    label.initUnitArray('expenses', units);
    label.initUnitArray('funds', units);
    label.initUnitArray('goals', units);
    label.initUnitArray('organizations', units);
    label.initUnitArray('people', units);
    label.initUnitArray('personRoles', units);
    label.initUnitArray('roles', units);
    label.initUnitArray('returns', units);
    label.initUnitArray('tasks', units);
    label.initUnitArray('timeEntries', units);

    return label;
  }

}

class CoreLabel extends LabeledEntity<ILabel, LabelRepository> {

  constructor(
    iGoal:IGoal
  ) {
    super(iGoal);
  }

  getRepository():GoalRepository {
    return REPOES.GoalRepository;
  };

}
