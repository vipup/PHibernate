/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "querydsl-typescript";
export declare class QueryState<QE extends IQEntity> {
    hasSelectAll: boolean;
    hasSelect: boolean;
    hasExecute: boolean;
    theWhere: QE;
    whereOthers: IQEntity[];
    includes: IQEntity[];
    setSelectAll(): void;
    setWhere(entity: QE): void;
    setSelect(): void;
    addWhereOther<OQE extends IQEntity>(otherQ: OQE): void;
    addInclude<OQE extends IQEntity>(otherQ: OQE): void;
    setExecute(repository?: any): void;
    equals(otherState: QueryState<QE>, checkValues?: boolean): boolean;
    private validateByOrAllSetup(errorPrefix);
    private validateByOrAllPresent(errorPrefix);
}
