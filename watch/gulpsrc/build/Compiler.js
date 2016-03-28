/// <reference path="typings/main.d.ts" />
"use strict";
var ts = require('typescript');
var fs = require('fs');
/**
 * Created by Papa on 3/26/2016.
 */
var filename = 'Entity.ts';
var filecontents = fs.readFileSync(filename).toString();
var program = ts.createProgram([filename], {});
var typeChecker = program.getTypeChecker();
// now get ast
var ast = ts.createSourceFile(filename, filecontents, ts.ScriptTarget.ES6, true);
// get node under question using ts.forEachChild (not shown here)
// const node = ts.forEachChild();
//
// const type = typeChecker.getTypeAtLocation(node); 
//# sourceMappingURL=Compiler.js.map