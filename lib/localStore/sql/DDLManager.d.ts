/**
 * Created by Papa on 8/31/2016.
 */
export declare class DDLManager {
    getCreateTableDDL(entityName: string, ifExistsSupported: string): string;
    warn(message: string): void;
}
