import {RoleRepository} from "./personnel/RoleRepository";
import {PersonRepository} from "./personnel/PersonRepository";
import {AreaRepository} from "./company/AreaRepository";
import {TimeEntryRepository} from "./time/TimeEntryRepository";
import {PersonRoleRepository} from "./personnel/PersonRoleRepository";
import {CompanyRepository} from "./company/CompanyRepository";
import {ContributionRepository} from "./funds/ContributionRepository";
import {FundRepository} from "./funds/FundRepository";
import {ReturnsRepository} from "./funds/ReturnsRepository";
import {OrganizationRepository} from "./funds/OrganizationRepository";
import {ExpenseRepository} from "./funds/ExpenseRepository";
import {GoalRepository} from "./building/GoalRepository";
import {StateRepository} from "./core/StateRepository";
import {LabelRepository} from "./core/LabelRepository";

/**
 * Created by Papa on 3/15/2016.
 */

export class Repositories {
  
  public areaRepository:AreaRepository;
  public companyRepository:CompanyRepository;
  public contributionRepository:ContributionRepository;
  public expenseRepository:ExpenseRepository;
  public fundRepository:FundRepository;
  public goalRepository:GoalRepository;
  public labelRepository:LabelRepository;
  public organizationRepository:OrganizationRepository;
  public personRepository:PersonRepository;
  public personRoleRepository:PersonRoleRepository;
  public returnsRepository:ReturnsRepository;
  public roleRepository:RoleRepository;
  public stateRepository:StateRepository;
  public taskRepository:TaskRepository;
  public timeEntryRepository:TimeEntryRepository;

  constructor(
  ) {
  }

}

export var REPOES:Repositories;
