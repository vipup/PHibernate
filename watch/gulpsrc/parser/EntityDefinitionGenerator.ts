/// <reference path="../../../typings/main.d.ts" />

/**
 * Created by Papa on 3/26/2016.
 */
import * as ts from "typescript";
import * as fs from 'fs';
import SyntaxKind = ts.SyntaxKind;
import {EntityCandidate} from "./EntityCandidate";
import {EntityCandidateRegistry} from "./EntityCandidateRegistry";
import {getParentClassName, getParentClassImport, getClassPath} from "./utils";
import {DocEntry} from "./DocEntry";


export var rootEntity = new EntityCandidate('Entity', null, null, 'PHibernate', true);
export var globalCandidateRegistry = new EntityCandidateRegistry(rootEntity);

/** Generate documention for all classes in a set of .ts files */
export function generateEntityDefinitions(
	fileNames:string[],
	options:ts.CompilerOptions
):EntityCandidate[] {
	// Build a program using the set of root file names in fileNames
	let program = ts.createProgram(fileNames, options);

	// Get the checker, we will use it to find more about classes
	let checker = program.getTypeChecker();
	var processedCandidateRegistry = new EntityCandidateRegistry(rootEntity);

	let output:DocEntry[] = [];

	// Visit every sourceFile in the program
	for (const sourceFile of program.getSourceFiles()) {
		// Walk the tree to search for classes
		ts.forEachChild(sourceFile, visit);
	}
	
	// print out the doc
	// fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));

	globalCandidateRegistry.verify();
	return globalCandidateRegistry.matchVerifiedEntities(processedCandidateRegistry);

	/** visit nodes finding exported classes */
	function visit( node:ts.Node ) {
		// Only consider exported nodes
		if (!isNodeExported(node)) {
			return;
		}

		if (node.kind === ts.SyntaxKind.ClassDeclaration) {
			// This is a top level class, get its symbol
			let symbol = checker.getSymbolAtLocation((<ts.ClassDeclaration>node).name);
			let serializedClass = serializeClass(symbol);
			if (serializedClass) {
				output.push(serializedClass);
			}
			// No need to walk any further, class expressions/inner declarations
			// cannot be exported
		}
		else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
			// This is a namespace, visit its children
			ts.forEachChild(node, visit);
		}
	}


	/** Serialize a symbol into a json object */
	function serializeSymbol( symbol:ts.Symbol ):DocEntry {
		return {
			name: symbol.getName(),
			documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
			type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
		};
	}

	/** Serialize a class symbol information */
	function serializeClass( symbol:ts.Symbol ) {
		let details = serializeSymbol(symbol);

		let properties:DocEntry[] = [];

		for (let memberName in symbol.members) {
			let member = symbol.members[memberName];
			if (member.valueDeclaration.kind === SyntaxKind.PropertyDeclaration) {
				console.log(`Property: ${memberName}`);
				let propertySymbolDescriptor = serializeSymbol(member);
				properties.push(propertySymbolDescriptor);
			}
		}
		details.properties = properties;

		// Get the construct signatures
		let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
		details.constructors = constructorType.getConstructSignatures().map(serializeSignature);

		let classPath = getClassPath(<ts.Node><any>symbol);

		// Only top level entities are supported
		if (!classPath) {
			return details;
		}

		let parentClassName = getParentClassName(symbol);
		let parentClassImport:string;
		if (parentClassName) {
			parentClassImport = getParentClassImport(<ts.Node><any>symbol, parentClassName);
		}
		let entityCandidate = EntityCandidate.create(details.name, classPath, parentClassName, parentClassImport);
		entityCandidate.docEntry = details;

		globalCandidateRegistry.addCandidate(entityCandidate);
		processedCandidateRegistry.addCandidate(entityCandidate);

		return details;
	}


	/** Serialize a signature (call or construct) */
	function serializeSignature( signature:ts.Signature ) {
		return {
			parameters: signature.parameters.map(serializeSymbol),
			returnType: checker.typeToString(signature.getReturnType()),
			documentation: ts.displayPartsToString(signature.getDocumentationComment())
		};
	}

	/** True if this is visible outside this file, false otherwise */
	function isNodeExported( node:ts.Node ):boolean {
		return (node.flags & ts.NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
	}
}