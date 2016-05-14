/**
 * Created by Papa on 4/30/2016.
 */
import { IQEntity } from "querydsl-typescript";
import { QueryState } from "./QueryState";
export interface QueryTokenNode {
    childNodes: QueryTokenNode[];
    indentation: number;
    parentNode: QueryTokenNode;
    queryLine: string;
    tokens: string[];
}
export declare class DSLParser {
    static parse<QE extends IQEntity<QE>>(query: string): QueryState<QE>;
    static getQueryTokenTree(queryLines: string[]): QueryTokenNode;
    static verifyIndentationUniformity(node: QueryTokenNode): void;
}
