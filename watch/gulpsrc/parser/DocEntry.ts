import {EntityCandidate} from "./EntityCandidate";
/**
 * Created by Papa on 3/28/2016.
 */

export interface DocEntry {
	name?:string,
	fileName?:string,
	documentation?:string,
	type?:string,
	constructors?:DocEntry[],
	parameters?:DocEntry[],
	properties?:PropertyDocEntry[],
	returnType?:string
}

export interface PropertyDocEntry extends DocEntry {
	entity?:EntityCandidate;
	primitive?:string;
	isArray?:boolean;
}