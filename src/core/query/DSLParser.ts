/**
 * Created by Papa on 4/30/2016.
 */
import {IQEntity} from "querydsl-typescript";
import {QueryState} from "./QueryState";

export interface QueryTokenNode {
	childNodes:QueryTokenNode[];
	indentation:number;
	parentNode:QueryTokenNode;
	queryLine:string;
	tokens:string[];
}

export class DSLParser {

	static parse<QE extends IQEntity>(
		query:string
	):QueryState<QE> {
		let queryLines = query.split('\n');
		let nonEmptyQueryLines = queryLines.filter((
			queryLine
		) => {
			return queryLine.trim().length > 0;
		});

		let queryTree:QueryTokenNode = this.getQueryTokenTree(nonEmptyQueryLines);

		this.verifyIndentationUniformity(queryTree);

		return null;
	}

	static getQueryTokenTree(
		queryLines:string[]
	):QueryTokenNode {
		let rootNode:QueryTokenNode = {
			childNodes: [],
			indentation: -1,
			parentNode: null,
			queryLine: null,
			tokens: null
		};
		let lastChild:QueryTokenNode = rootNode;

		queryLines.forEach((
			queryLine:string
		) => {
			let lineFragments = queryLine.split(' ');
			let currentIndentationLevel = 0;
			for (let i = 0; i < lineFragments.length; i++) {
				let fragment = lineFragments[i];
				if (fragment !== '' && fragment !== '\t') {
					break;
				}
				if (fragment === '') {
					throw `Cannot indent with spaces: ${queryLine}`;
				}
				currentIndentationLevel++;
			}

			let normalizedQueryLine = queryLine.trim().replace('\t', ' ');
			let tokens = normalizedQueryLine.split(' ').filter((
				token:string
			) => {
				return token !== '';
			});

			let currentChild = {
				childNodes: [],
				indentation: currentIndentationLevel,
				parentNode: null,
				queryLine: queryLine,
				tokens: tokens
			};

			let parentCandidate = lastChild;
			while (parentCandidate.indentation >= currentIndentationLevel) {
				parentCandidate = parentCandidate.parentNode;
			}
			currentChild.parentNode = parentCandidate;
			parentCandidate.childNodes.push(currentChild);

			lastChild = currentChild;
		});

		return rootNode;
	}

	static verifyIndentationUniformity(
		node:QueryTokenNode
	):void {
		if (!node.childNodes || !node.childNodes.length) {
			return;
		}

		let expectedIndentation = node.childNodes[0].indentation;
		node.childNodes.forEach((
			childNode:QueryTokenNode
		) => {
			if (childNode.indentation !== expectedIndentation) {
				throw `Unexpected indentation level, got ${childNode.indentation}, expecting ${expectedIndentation}: ${childNode.queryLine}`;
			}

			this.verifyIndentationUniformity(childNode);
		});

	}

}