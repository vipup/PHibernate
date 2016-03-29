/// <reference path="../typings/main.d.ts" />

import * as ts from "typescript";
import SyntaxKind = ts.SyntaxKind;
/**
 * Created by Papa on 3/27/2016.
 */

export function getClassPath(
	classSymbol:ts.Node
):string {
	let classPath:string = null;

	let parent = <ts.Symbol><any>classSymbol.parent;
	if (!parent) {
		return classPath;
	}
	let valueDeclaration:ts.SourceFile = <ts.SourceFile>parent.valueDeclaration;
	if (!valueDeclaration || valueDeclaration.kind !== SyntaxKind.SourceFile) {
		return classPath;
	}
	classPath = valueDeclaration.path;

	return classPath;
}

export function getParentClassImport(
	classSymbol:ts.Node,
	parentClassName:string
):string {
	let parentClassImport:string = null;

	let parent = <ts.Symbol><any>classSymbol.parent;
	if (!parent) {
		return parentClassImport;
	}
	let valueDeclaration:ts.SourceFile = <ts.SourceFile>parent.valueDeclaration;
	if (!valueDeclaration || valueDeclaration.kind !== SyntaxKind.SourceFile) {
		return parentClassImport;
	}
	let imports:ts.Identifier[] = (<any>valueDeclaration)['imports'];
	if (!imports || !imports.length) {
		return parentClassImport;
	}
	imports.some((
		anImport:ts.Identifier
	) => {
		if (anImport.kind !== SyntaxKind.StringLiteral) {
			return false;
		}
		let parent = anImport.parent;
		if (!parent || parent.kind !== SyntaxKind.ImportDeclaration) {
			return false;
		}
		let nameMatches = endsWith(anImport.text, parentClassName);
		if (nameMatches && anImport.text.length > parentClassName.length) {
			nameMatches = endsWith(anImport.text, `/${parentClassName}`);
		}
		if (nameMatches) {
			parentClassImport = anImport.text;
			return true;
		}
	});

	return parentClassImport;
}

export function getParentClassName(
	classSymbol:ts.Symbol
):string {
	let parentEntityName:string = null;

	if (!classSymbol.declarations || !classSymbol.declarations.length) {
		return parentEntityName;
	}

	classSymbol.declarations.some((
		declaration:ts.ClassLikeDeclaration
	) => {
		if (declaration.kind !== SyntaxKind.ClassDeclaration) {
			return false;
		}
		let heritageClauses = declaration.heritageClauses;
		if (!heritageClauses || !heritageClauses.length) {
			return false;
		}
		return heritageClauses.some((
			heritageClause:ts.HeritageClause
		) => {
			if (heritageClause.kind !== SyntaxKind.HeritageClause) {
				return false;
			}
			if (heritageClause.token !== SyntaxKind.ExtendsKeyword) {
				return false;
			}
			let types = heritageClause.types;
			if (!types || !types.length) {
				return false;
			}
			return types.some((
				type:ts.ExpressionWithTypeArguments
			) => {
				let expression:ts.Identifier = <any>type.expression;
				if (!expression || expression.kind !== SyntaxKind.Identifier) {
					return false;
				}
				parentEntityName = expression.text;
				return true;
			});
		});
	});

	return parentEntityName;
}

export function endsWith(
	target:string,
	suffix:string
) {
	return target.indexOf(suffix, target.length - suffix.length) !== -1;
}