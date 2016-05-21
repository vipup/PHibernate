import {EntityProxyClass, EntityProxy, EntityField} from "./Proxies";
import {FieldType} from "querydsl-typescript";

/**
 * Created by Papa on 5/15/2016.
 */

export class ProxyGenerator {

	static setupEntityField(
		Class:any,
		propertyName:string,
		fieldType:FieldType,
		RelatedEntityClass?:any
	):void {
		// This references point to the object
		let propertyWrapper:EntityField = {
			get: function () {
				let proxy = ProxyGenerator.setupProxy(this);
				if (proxy.__data__.__initialized__[propertyName]) {
					return proxy.__data__.__current__[propertyName];
				} else {
					proxy.__data__.__accessed__[propertyName] = true;
					return ProxyGenerator.getDefaultValue(fieldType, RelatedEntityClass);
				}
			},
			set: function (value) {
				let proxy = ProxyGenerator.setupProxy(this);
				let currentValue = proxy.__data__.__current__[propertyName];
				if (currentValue === value) {
					return;
				}
				proxy.__isDirty__ = true;
				proxy.__data__.__current__[propertyName] = value;
			}
		};
		let proxiedClass:EntityProxyClass = <EntityProxyClass>Class;
		proxiedClass.__fieldMap__[propertyName] = propertyWrapper;
		proxiedClass.__fieldTypeMap__[propertyName] = fieldType;

		Object.defineProperty(proxiedClass, propertyName, propertyWrapper);
	}

	static getDefaultValue(
		fieldType:FieldType,
		RelatedEntityClass?:any
	):any {
		switch (fieldType) {
			case FieldType.BOOLEAN:
				return false;
			case FieldType.DATE:
				return new Date(0);
			case FieldType.ENTITY:
				let entity = new RelatedEntityClass();
				return entity;
			case FieldType.ENTITY_ARRAY:
				let entityArray = [];
				let memberEntity = new RelatedEntityClass();
				entityArray.push(memberEntity);
				return entityArray;
			case FieldType.NUMBER:
				return 0;
			case FieldType.STRING:
				return '';
		}
	}

	static setupProxy(
		entity:any
	):EntityProxy {
		let proxy = <EntityProxy>entity;

		if (proxy.__proxied__) {
			return proxy;
		}

		proxy.__data__ = {
			__accessed__: {},
			__current__: {},
			__initialized__: {},
			__original__: {}
		};

		proxy.__proxied__ = true;

		return proxy;
	}

}