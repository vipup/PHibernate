import {EntityProxyClass, EntityProxy, EntityField} from "./Proxies";
import {FieldType, RelationType} from "querydsl-typescript";
import {RecordState} from "../../store/RecordState";

/**
 * Created by Papa on 5/15/2016.
 */

export class ProxyGenerator {

	static setupEntityField(
		Class:any,
		propertyName:string,
		fieldType:FieldType
	):void {
		// This references point to the object
		let propertyWrapper:EntityField = {
			get: function () {
				let proxy = ProxyGenerator.setupProxy(this);
				let state = proxy.__recordState__;
				if (state.data.initialized[propertyName]) {
					return state.data.current[propertyName];
				} else {
					state.data.accessed[propertyName] = true;
					return ProxyGenerator.getDefaultFieldValue(fieldType);
				}
			},
			set: function (value) {
				let proxy = ProxyGenerator.setupProxy(this);
				let state = proxy.__recordState__;
				let currentValue = state.data.current[propertyName];
				if (currentValue === value) {
					return;
				}
				state.isDirty = true;
				state.data.current[propertyName] = value;
			}
		};
		let proxiedClass:EntityProxyClass = <EntityProxyClass>Class;
		proxiedClass.__fieldMap__[propertyName] = propertyWrapper;
		proxiedClass.__fieldTypeMap__[propertyName] = fieldType;

		Object.defineProperty(proxiedClass, propertyName, propertyWrapper);
	}

	static setupEntityRelation(
		Class:any,
		propertyName:string,
		relationType:RelationType,
		RelatedEntityClass:any
	):void {
		// This references point to the object
		let propertyWrapper:EntityField = {
			get: function () {
				let proxy = ProxyGenerator.setupProxy(this);
				let state = proxy.__recordState__;
				if (state.data.initialized[propertyName]) {
					return state.data.current[propertyName];
				} else {
					state.data.accessed[propertyName] = true;
					return ProxyGenerator.getDefaultRelationValue(relationType, RelatedEntityClass);
				}
			},
			set: function (value) {
				let proxy = ProxyGenerator.setupProxy(this);
				let state = proxy.__recordState__;
				let currentValue = state.data.current[propertyName];
				if (currentValue === value) {
					return;
				}
				state.isDirty = true;
				state.data.current[propertyName] = value;
			}
		};
		let proxiedClass:EntityProxyClass = <EntityProxyClass>Class;
		proxiedClass.__relationMap__[propertyName] = propertyWrapper;
		proxiedClass.__relationTypeMap__[propertyName] = relationType;

		Object.defineProperty(proxiedClass, propertyName, propertyWrapper);
	}

	static getDefaultFieldValue(
		fieldType:FieldType
	):any {
		switch (fieldType) {
			case FieldType.BOOLEAN:
				return false;
			case FieldType.DATE:
				return new Date(0);
			case FieldType.NUMBER:
				return 0;
			case FieldType.STRING:
				return '';
			default:
				throw `Unknown Field Type: ${fieldType}`;
		}
	}

	static getDefaultRelationValue(
		relationType:RelationType,
		RelatedEntityClass:any
	):any {
		switch (relationType) {
			case RelationType.MANY_TO_ONE:
				let entity = new RelatedEntityClass();
				return entity;
			case RelationType.ONE_TO_MANY:
				let entityArray = [];
				let memberEntity = new RelatedEntityClass();
				entityArray.push(memberEntity);
				return entityArray;
			default:
				throw `Unknown Relation Type ${relationType}`;
		}
	}

	static setupProxy(
		entity:any
	):EntityProxy {
		let proxy = <EntityProxy>entity;
		let state = proxy.__recordState__;

		if (state) {
			state.proxied = true;
			return proxy;
		}

		state = new RecordState();
		state.proxied = true;
		proxy.__recordState__ = state;

		return proxy;
	}

}