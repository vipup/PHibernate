/**
 * Created by Papa on 9/8/2016.
 */
export declare class UpdateCache {
    static updateCache: {
        [entityName: string]: {
            [id: string]: any;
        };
    };
    static initCache(): void;
    static dropCache(): void;
    static saveToUpdateCache(entityName: string, entity: any): any;
    static getUpdateCache(entityName: string, id: any): any;
    static getEntityUpdateCache(entityName: string, entity: any): any;
    static getIdString(id: any): any;
    static getEntityUpdateDiff(entityName: string, entity: any): any;
    static valuesEqualIgnoreObjects(original: any, updated: any): boolean;
}
