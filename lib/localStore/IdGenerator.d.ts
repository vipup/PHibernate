export declare enum IdGeneration {
    USER_TIMESTAMP = 0,
}
export interface IdGenerator {
    generateId(entityClass: {
        new (): any;
    }): string | number;
    getIdType(): 'string' | 'number';
}
export declare class UserTimeStampIdGenerator implements IdGenerator {
    lastIdForTimeStamp: number;
    lastTimestamp: number;
    generateId(entityClass: {
        new (): any;
    }): string | number;
    getIdType(): 'string' | 'number';
}
export declare function getIdGenerator(idGeneration: IdGeneration): UserTimeStampIdGenerator;
