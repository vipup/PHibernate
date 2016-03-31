/**
 * Created by Papa on 3/30/2016.
 */
/// <reference path="../../typings/main.d.ts" />

import * as fs from "fs";
import * as ts from "typescript";
import {generateEntityDefinitions} from "./parser/EntityDefinitionGenerator";
import {EntityCandidate} from "./parser/EntityCandidate";

function watch(
	rootFileNames:string[],
	options:ts.CompilerOptions
) {
	const files:ts.Map<{ version:number }> = {};

	// initialize the list of files
	rootFileNames.forEach(
		fileName => {
			files[fileName] = {version: 0};
		});

	// Create the language service host to allow the LS to communicate with the host
	const servicesHost:ts.LanguageServiceHost = {
		getScriptFileNames: () => rootFileNames,
		getScriptVersion: ( fileName ) => files[fileName] && files[fileName].version.toString(),
		getScriptSnapshot: ( fileName ) => {
			if (!fs.existsSync(fileName)) {
				return undefined;
			}

			return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
		},
		getCurrentDirectory: () => process.cwd(),
		getCompilationSettings: () => options,
		getDefaultLibFileName: ( options ) => ts.getDefaultLibFilePath(options)
	};

	// Create the language service files
	const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

	// First time around, process all files
	processFiles(rootFileNames);

	// Now let's watch the files
	rootFileNames.forEach(
		fileName => {
			// Add a watch on the file to handle next change
			fs.watchFile(fileName,
				{persistent: true, interval: 250},
				(
					curr,
					prev
				) => {
					// Check timestamp
					if (+curr.mtime <= +prev.mtime) {
						return;
					}

					// Update the version to signal a change in the file
					files[fileName].version++;

					// process file
					processFiles([fileName]);
				});
		});

	function processFiles( rootFileNames:string[] ):void {
		let entities:EntityCandidate[] = generateEntityDefinitions(rootFileNames, {
			target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
		});
	}

	function emitFiles(
		entities:EntityCandidate[]
	):void {
		entities.forEach((
			entity:EntityCandidate
		) => {
			// TODO: work here next
		});
	}

	function emitFile( fileName:string ) {
		let output = services.getEmitOutput(fileName);

		if (!output.emitSkipped) {
			console.log(`Emitting ${fileName}`);
		}
		else {
			console.log(`Emitting ${fileName} failed`);
			logErrors(fileName);
		}

		output.outputFiles.forEach(
			o => {
				fs.writeFileSync(o.name, o.text, "utf8");
			});
	}

	function logErrors( fileName:string ) {
		let allDiagnostics = services.getCompilerOptionsDiagnostics()
			.concat(services.getSyntacticDiagnostics(fileName))
			.concat(services.getSemanticDiagnostics(fileName));

		allDiagnostics.forEach(
			diagnostic => {
				let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
				if (diagnostic.file) {
					let {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
					console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
				}
				else {
					console.log(`  Error: ${message}`);
				}
			});
	}
}

// Initialize files constituting the program as all .ts files in the current directory
const currentDirectoryFiles = fs.readdirSync(process.cwd()).filter(
	fileName=> fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts");

// Start the watcher
watch(currentDirectoryFiles, {module: ts.ModuleKind.CommonJS});