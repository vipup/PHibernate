import { IAbstractEntityChange, AbstractEntityChange, StubAbstractEntityChange } from "./AbstractEntityChange";
/**
 * Created by Papa on 9/15/2016.
 */
export interface IEntityWhereChange extends IAbstractEntityChange {
    queryJson: string;
}
export declare class EntityWhereChange extends AbstractEntityChange implements IEntityWhereChange {
    queryJson: string;
}
export declare class StubWhereEntityChange extends StubAbstractEntityChange implements IEntityWhereChange {
    queryJson: string;
}
