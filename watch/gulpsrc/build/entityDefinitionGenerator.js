/// <reference path="typings/main.d.ts" />
"use strict";
/**
 * Created by Papa on 3/26/2016.
 */
var ts = require("typescript");
var fs = require('fs');
var SyntaxKind = ts.SyntaxKind;
var EntityCandidate = (function () {
    function EntityCandidate(type, parent, location, verified) {
        this.type = type;
        this.location = location;
        this.verified = verified;
        if (typeof parent === 'EntityCandidate') {
            this.parent = parent;
        }
        else {
            this.parentKeyword = parent;
        }
    }
    EntityCandidate.prototype.matches = function (type) {
        return this.type === type;
    };
    return EntityCandidate;
}());
var rootEntity = new EntityCandidate('Entity', null, 'PHibernate', true);
var EntityCandidateRegistry = (function () {
    function EntityCandidateRegistry() {
        this.entityCandidateMap = {};
    }
    return EntityCandidateRegistry;
}());
var entityCandidateRegistry = new EntityCandidateRegistry();
/** Generate documention for all classes in a set of .ts files */
function generateEntityDefinitions(fileNames, options) {
    // Build a program using the set of root file names in fileNames
    var program = ts.createProgram(fileNames, options);
    // Get the checker, we will use it to find more about classes
    var checker = program.getTypeChecker();
    var output = [];
    // Visit every sourceFile in the program
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, visit);
    }
    // print out the doc
    fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));
    return;
    /** visit nodes finding exported classes */
    function visit(node) {
        // Only consider exported nodes
        if (!isNodeExported(node)) {
            return;
        }
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            // This is a top level class, get its symbol
            var symbol = checker.getSymbolAtLocation(node.name);
            var serializedClass = serializeClass(symbol);
            if (serializedClass) {
                output.push(serializedClass);
            }
        }
        else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }
    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol) {
        return {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
        };
    }
    /** Serialize a class symbol infomration */
    function serializeClass(symbol) {
        var details = serializeSymbol(symbol);
        if (!importsEntity(symbol)) {
            return null;
        }
        if (!extendsEntity(symbol)) {
            return null;
        }
        var properties = [];
        for (var memberName in symbol.members) {
            var member = symbol.members[memberName];
            if (member.valueDeclaration.kind === SyntaxKind.PropertyDeclaration) {
                console.log("Property: " + memberName);
                var propertySymbolDescriptor = serializeSymbol(member);
                properties.push(propertySymbolDescriptor);
                console.log(propertySymbolDescriptor);
            }
        }
        details.properties = properties;
        // Get the construct signatures
        var constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        details.constructors = constructorType.getConstructSignatures().map(serializeSignature);
        return details;
    }
    function importsEntity(classSymbol) {
        var parent = classSymbol.parent;
        if (!parent) {
            return false;
        }
        var valueDeclaration = parent.valueDeclaration;
        if (!valueDeclaration || valueDeclaration.kind !== SyntaxKind.SourceFile) {
            return false;
        }
        var imports = valueDeclaration['imports'];
        if (!imports || !imports.length) {
            return false;
        }
        return imports.some(function (anImport) {
            if (anImport.kind !== SyntaxKind.StringLiteral) {
                return false;
            }
            var parent = anImport.parent;
            if (!parent || parent.kind !== SyntaxKind.ImportDeclaration) {
                return false;
            }
            return endsWith(anImport.text, 'Entity');
        });
    }
    function endsWith(target, suffix) {
        return target.indexOf(suffix, target.length - suffix.length) !== -1;
    }
    function extendsEntity(classSymbol) {
        if (!classSymbol.declarations || !classSymbol.declarations.length) {
            return false;
        }
        return classSymbol.declarations.some(function (declaration) {
            if (declaration.kind !== SyntaxKind.ClassDeclaration) {
                return false;
            }
            var heritageClauses = declaration.heritageClauses;
            if (!heritageClauses || !heritageClauses.length) {
                return false;
            }
            return heritageClauses.some(function (heritageClause) {
                if (heritageClause.kind !== SyntaxKind.HeritageClause) {
                    return false;
                }
                if (heritageClause.token !== SyntaxKind.ExtendsKeyword) {
                    return false;
                }
                var types = heritageClause.types;
                if (!types || !types.length) {
                    return false;
                }
                return types.some(function (type) {
                    var expression = type.expression;
                    if (!expression || expression.kind !== SyntaxKind.Identifier) {
                        return false;
                    }
                    return expression.text === 'Entity';
                });
            });
        });
    }
    /** Serialize a signature (call or construct) */
    function serializeSignature(signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment())
        };
    }
    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node) {
        return (node.flags & ts.NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }
}
generateEntityDefinitions(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});
//# sourceMappingURL=entityDefinitionGenerator.js.map