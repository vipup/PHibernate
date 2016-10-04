import { DeltaRecord } from "./DeltaRecord";
import { ChangeGroup } from "./ChangeGroup";
/**
 * Created by Papa on 10/4/2016.
 */
export declare enum EntityChangeType {
    CREATE = 0,
    DELETE = 1,
    DELETE_WHERE = 2,
    UPDATE = 3,
    UPDATE_WHERE = 4,
}
export interface IAbstractEntityChange {
    entityName: string;
    changeType: EntityChangeType;
    entityChangeIdInGroup: number;
    changeGroup: ChangeGroup;
}
export declare class AbstractEntityChange extends DeltaRecord {
    static getEntityChangeId(entityIdInGroup: number, createDeviceId: string, createDateTime: Date, createUserId: string, indexInMillisecond: number): string;
    entityName: string;
    changeType: EntityChangeType;
    entityChangeIdInGroup: number;
    changeGroup: ChangeGroup;
}
export declare class StubAbstractEntityChange implements IAbstractEntityChange {
    entityName: string;
    changeType: EntityChangeType;
    entityChangeIdInGroup: number;
    changeGroup: ChangeGroup;
}
