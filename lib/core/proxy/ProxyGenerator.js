"use strict";
var Proxies_1 = require("./Proxies");
/**
 * Created by Papa on 5/15/2016.
 */
function getProxy(entity) {
}
exports.getProxy = getProxy;
var ProxyGenerator = (function () {
    function ProxyGenerator() {
    }
    ProxyGenerator.functionSetupFieldProxy = function (entity, propertyName, fieldType, RelatedEntityClass) {
        var proxy = this.setupProxy(entity);
        proxy.__data__.__types__[propertyName] = fieldType;
        var propertyWrapper = {
            get: function () {
                if (proxy.__data__.__initialized__[propertyName]) {
                    return proxy.__data__.__current__[propertyName];
                }
                else {
                    proxy.__data__.__accessed__[propertyName] = true;
                    return this.getDefaultValue(fieldType, RelatedEntityClass);
                }
            },
            set: function (value) {
                var currentValue = proxy.__data__.__current__[propertyName];
                if (currentValue === value) {
                    return;
                }
                proxy.__isDirty__ = true;
                proxy.__data__.__current__[propertyName] = value;
            }
        };
        var proxiedClass = proxy.constructor.prototype;
        proxiedClass.___propertyWrapperMap[propertyName] = propertyWrapper;
        Object.defineProperty(proxiedClass, propertyName, propertyWrapper);
    };
    ProxyGenerator.getDefaultValue = function (fieldType, RelatedEntityClass) {
        switch (fieldType) {
            case Proxies_1.FieldType.BOOLEAN:
                return false;
            case Proxies_1.FieldType.DATE:
                return new Date(0);
            case Proxies_1.FieldType.ENTITY:
                var entity = new RelatedEntityClass();
                return entity;
            case Proxies_1.FieldType.ENTITY_ARRAY:
                var entityArray = [];
                var memberEntity = new RelatedEntityClass();
                entityArray.push(memberEntity);
                return entityArray;
            case Proxies_1.FieldType.NUMBER:
                return 0;
            case Proxies_1.FieldType.STRING:
                return '';
        }
    };
    ProxyGenerator.setupProxy = function (entity) {
        var proxy = entity;
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
    };
    return ProxyGenerator;
}());
exports.ProxyGenerator = ProxyGenerator;
//# sourceMappingURL=ProxyGenerator.js.map