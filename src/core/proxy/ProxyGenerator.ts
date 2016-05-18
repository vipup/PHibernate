import {IProxiedEntity, IEntityProxyWrapper, FieldType} from "./Proxies";
/**
 * Created by Papa on 5/15/2016.
 */

export function getProxy(
	entity:any
):any {

}
export class ProxyGenerator {
	static functionSetupFieldProxy(
		entity:any,
		propertyName:string,
		fieldType:FieldType
	):void {
		let proxy = this.setupProxy(entity);

		proxy.__data__.__types__[propertyName] = fieldType;

		let propertyWrapper:IEntityProxyWrapper = {
			get: function () {
				if (proxy.__data__.__initialized__[propertyName]) {
					return proxy.__data__.__current__[propertyName];
				} else {
					proxy.__data__.__accessed__[propertyName] = true;
					return this.getDefaultValue(fieldType);
				}
			},
			set: function ( value ) {
				let currentValue = proxy.__data__.__current__[propertyName];
				if (currentValue === value) {
					return;
				}
				proxy.__isDirty__ = true;
				proxy.__data__.__current__[propertyName] = value;
			}
		};
	}

	static getDefaultValue(
		fieldType:FieldType
	):any {
		switch(fieldType) {
			case FieldType.BOOLEAN:
				return false;
			case FieldType.DATE:
				return new Date(0);
			case FieldType.ENTITY:
				// FIXME: implement default values for entity proxies
				return null;
			case FieldType.NUMBER:
				return 0;
			case FieldType.STRING:
				return '';
		}
	}

	static setupProxy(
		entity:any
	):IProxiedEntity {
		let proxy = <IProxiedEntity>entity;

		if (proxy.__proxied__) {
			return proxy;
		}

		proxy.__data__ = {
			__accessed__: {},
			__current__: {},
			__initialized__: {},
			__original__: {},
			__types__: {}
		};

		proxy.__proxied__ = true;

		return proxy;
	}

}