/// <reference path="typings/main.d.ts" />

import * as ts from 'typescript';
import * as fs from 'fs';

/**
 * Created by Papa on 3/26/2016.
 */

let filename = 'Entity.ts';

let filecontents = fs.readFileSync(filename).toString();

const program = ts.createProgram([filename], {});
const typeChecker = program.getTypeChecker();
// now get ast
const ast = ts.createSourceFile(filename, filecontents, ts.ScriptTarget.ES6, true);
// get node under question using ts.forEachChild (not shown here)
// const node = ts.forEachChild();
//
// const type = typeChecker.getTypeAtLocation(node);