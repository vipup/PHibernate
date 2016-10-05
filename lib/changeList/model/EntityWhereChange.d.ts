import { AbstractEntityChangeApi, AbstractEntityChange, StubAbstractEntityChange } from "./AbstractEntityChange";
/**
 * Created by Papa on 9/15/2016.
 */
export interface EntityWhereChangeApi extends AbstractEntityChangeApi {
    numberOfAffectedRecords: number;
    queryJson: string;
}
export declare class EntityWhereChange extends AbstractEntityChange implements EntityWhereChangeApi {
    numberOfAffectedRecords: number;
    queryJson: string;
}
export declare class StubWhereEntityChange extends StubAbstractEntityChange implements EntityWhereChangeApi {
    numberOfAffectedRecords: number;
    queryJson: string;
}
