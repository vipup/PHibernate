import { EntityChange } from "../changeList/model/EntityChange";
import { ChangeGroup } from "../changeList/model/ChangeGroup";
export declare enum IdGeneration {
    ENTITY_CHANGE_ID = 0,
}
export interface IdGenerator {
    generateChangeGroupId(changeGroup: ChangeGroup): string;
    generateEntityId(entity: any, entityChange: EntityChange): string;
    getIdType(): 'string' | 'number';
}
export declare class UserTimeStampIdGenerator implements IdGenerator {
    lastChangeGroupIndexForTimeStamp: number;
    lastChangeGroupTimestamp: number;
    generateChangeGroupId(changeGroup: ChangeGroup): string;
    generateEntityId(entity: any, entityChange: EntityChange): string;
    getChangeGroupIndexInMillisecond(): number;
    getIdType(): 'string' | 'number';
}
export declare function getIdGenerator(idGeneration: IdGeneration): UserTimeStampIdGenerator;
