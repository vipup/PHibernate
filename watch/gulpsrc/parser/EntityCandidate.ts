/**
 * Created by Papa on 3/27/2016.
 */

export class EntityCandidate {

	static create(
		type:string,
		parentClass:string,
		parentImport:string
	):EntityCandidate {
		return new EntityCandidate(type, parentClass);
	}

	public parent:EntityCandidate;
	public parentKeyword:string;

	constructor(
		public type:string,
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