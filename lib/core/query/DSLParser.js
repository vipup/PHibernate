"use strict";
class DSLParser {
    static parse(query) {
        let queryLines = query.split('\n');
        let nonEmptyQueryLines = queryLines.filter((queryLine) => {
            return queryLine.trim().length > 0;
        });
        let queryTree = this.getQueryTokenTree(nonEmptyQueryLines);
        this.verifyIndentationUniformity(queryTree);
        return null;
    }
    static getQueryTokenTree(queryLines) {
        let rootNode = {
            childNodes: [],
            indentation: -1,
            parentNode: null,
            queryLine: null,
            tokens: null
        };
        let lastChild = rootNode;
        queryLines.forEach((queryLine) => {
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
            let tokens = normalizedQueryLine.split(' ').filter((token) => {
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
    static verifyIndentationUniformity(node) {
        if (!node.childNodes || !node.childNodes.length) {
            return;
        }
        let expectedIndentation = node.childNodes[0].indentation;
        node.childNodes.forEach((childNode) => {
            if (childNode.indentation !== expectedIndentation) {
                throw `Unexpected indentation level, got ${childNode.indentation}, expecting ${expectedIndentation}: ${childNode.queryLine}`;
            }
            this.verifyIndentationUniformity(childNode);
        });
    }
}
exports.DSLParser = DSLParser;
//# sourceMappingURL=DSLParser.js.map