/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "querydsl-typescript";
export declare class QueryState<QE extends IQEntity<QE>> {
    hasAll: boolean;
    hasFind: boolean;
    hasRetrieve: boolean;
    theBy: QE;
    byOthers: IQEntity<QE>[];
    includes: IQEntity<QE>[];
    setSelectAll(): void;
    setWhere(entity: QE): void;
    setSelect(): void;
    addWhereOther<OQE extends IQEntity<QE>>(otherQ: OQE): void;
    addInclude<OQE extends IQEntity<QE>>(otherQ: OQE): void;
    setRetrieve(repository?: any): void;
    equals(otherState: QueryState<QE>, checkValues?: boolean): boolean;
    private validateByOrAllSetup(errorPrefix);
    private validateByOrAllPresent(errorPrefix);
}
