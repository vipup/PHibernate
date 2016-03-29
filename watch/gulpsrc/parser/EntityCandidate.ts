import {DocEntry} from "./DocEntry";
/**
 * Created by Papa on 3/27/2016.
 */

export class EntityCandidate {
	
	docEntry:DocEntry;

	static create(
		type:string,
		path:string,
		parentClass:string,
		parentImport:string
	):EntityCandidate {
		return new EntityCandidate(type, path, parentClass, parentImport);
	}

	public parent:EntityCandidate;
	public parentKeyword:string;

	constructor(
		public type:string,
		public path:string,
		parent:EntityCandidate | string,
		private location?:string,
		private verified?:boolean
	) {
		if (typeof parent === 'EntityCandidate') {
			this.parent = parent;
		} else {
			this.parentKeyword = <string>parent;
		}
	}

	matches(
		type:string,
		location?:string
	):boolean {
		return this.type === type;
	}

}