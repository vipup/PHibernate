"use strict";
var DSLParser = (function () {
    function DSLParser() {
    }
    DSLParser.parse = function (query) {
        var queryLines = query.split('\n');
        var nonEmptyQueryLines = queryLines.filter(function (queryLine) {
            return queryLine.trim().length > 0;
        });
        var queryTree = this.getQueryTokenTree(nonEmptyQueryLines);
        this.verifyIndentationUniformity(queryTree);
        return null;
    };
    DSLParser.getQueryTokenTree = function (queryLines) {
        var rootNode = {
            childNodes: [],
            indentation: -1,
            parentNode: null,
            queryLine: null,
            tokens: null
        };
        var lastChild = rootNode;
        queryLines.forEach(function (queryLine) {
            var lineFragments = queryLine.split(' ');
            var currentIndentationLevel = 0;
            for (var i = 0; i < lineFragments.length; i++) {
                var fragment = lineFragments[i];
                if (fragment !== '' && fragment !== '\t') {
                    break;
                }
                if (fragment === '') {
                    throw "Cannot indent with spaces: " + queryLine;
                }
                currentIndentationLevel++;
            }
            var normalizedQueryLine = queryLine.trim().replace('\t', ' ');
            var tokens = normalizedQueryLine.split(' ').filter(function (token) {
                return token !== '';
            });
            var currentChild = {
                childNodes: [],
                indentation: currentIndentationLevel,
                parentNode: null,
                queryLine: queryLine,
                tokens: tokens
            };
            var parentCandidate = lastChild;
            while (parentCandidate.indentation >= currentIndentationLevel) {
                parentCandidate = parentCandidate.parentNode;
            }
            currentChild.parentNode = parentCandidate;
            parentCandidate.childNodes.push(currentChild);
            lastChild = currentChild;
        });
        return rootNode;
    };
    DSLParser.verifyIndentationUniformity = function (node) {
        var _this = this;
        if (!node.childNodes || !node.childNodes.length) {
            return;
        }
        var expectedIndentation = node.childNodes[0].indentation;
        node.childNodes.forEach(function (childNode) {
            if (childNode.indentation !== expectedIndentation) {
                throw "Unexpected indentation level, got " + childNode.indentation + ", expecting " + expectedIndentation + ": " + childNode.queryLine;
            }
            _this.verifyIndentationUniformity(childNode);
        });
    };
    return DSLParser;
}());
exports.DSLParser = DSLParser;
//# sourceMappingURL=DSLParser.js.map