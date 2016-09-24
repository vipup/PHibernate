import { EntityChange, IEntityChange } from "./EntityChange";
import { DeltaRecord } from "./DeltaRecord";
import { IdGenerator } from "../../localStore/IdGenerator";
/**
 * Created by Papa on 9/15/2016.
 */
export interface IChangeGroup {
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): IEntityChange;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
}
export declare class ChangeGroup extends DeltaRecord implements IChangeGroup {
    static getNewChangeGroup(type: string, idGenerator: IdGenerator): ChangeGroup;
    type: string;
    entityChanges: EntityChange[];
    numberOfEntitiesInGroup: number;
    groupIndexInMillisecond: number;
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): IEntityChange;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    private addNewEntityChange(entityName);
}
export declare class StubChangeGroup implements IChangeGroup {
    addNewCreateEntityChange(entityName: string, entity: any, idProperty: string, idGenerator: IdGenerator): IEntityChange;
    addNewDeleteEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
    addNewUpdateEntityChange(entityName: string, entity: any, idProperty: string): IEntityChange;
}
