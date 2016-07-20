/**
 * Created by Papa on 6/28/2016.
 */

export enum CascadeType {
	ALL, //Cascade all operations
	DETACH, // Cascade detach operation
	MERGE, // Cascade merge operation
	PERSIST, // Cascade persist operation
	REFRESH, // Cascade refresh operation
	REMOVE // Cascade remove operation
}

export enum FetchType {
	EAGER, // Defines that data must be eagerly fetched.
	LAZY // Defines that data can be lazily fetched.
}


export interface ManyToOneElements {
	cascade?:CascadeType;
	fetch?:FetchType;
	optional?:boolean;
}

export interface OneToManyElements {
	cascade?:CascadeType;
	fetch?:FetchType;
	mappedBy:string;
	orphanRemoval?:boolean;
}