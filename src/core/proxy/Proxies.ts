import {FieldType, RelationType} from "querydsl-typescript";
import {ChangeRecord} from "delta-store/lib/index";
import {IRecordState} from "../../store/RecordState";
/**
 * Created by Papa on 5/17/2016.
 */


export interface EntityField {
	get:{():any};
	set:{(value:any):void};
}

export interface EntityRelation {
	get:{():any};
	set:{(value:any):void};
}

export interface EntityProxy {
	__recordState__:IRecordState;
}

export interface EntityProxyClass {
	__fieldMap__:{[fieldName:string]:EntityField};
	__fieldTypeMap__:{[fieldName:string]:FieldType};
	__relationMap__:{[relationName:string]:EntityRelation};
	__relationTypeMap__:{[relationName:string]:RelationType};
}