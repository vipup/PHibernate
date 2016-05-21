"use strict";
var querydsl_typescript_1 = require("querydsl-typescript");
/**
 * Created by Papa on 5/15/2016.
 */
var ProxyGenerator = (function () {
    function ProxyGenerator() {
    }
    ProxyGenerator.setupEntityField = function (Class, propertyName, fieldType) {
        // This references point to the object
        var propertyWrapper = {
            get: function () {
                var proxy = ProxyGenerator.setupProxy(this);
                if (proxy.__data__.__initialized__[propertyName]) {
                    return proxy.__data__.__current__[propertyName];
                }
                else {
                    proxy.__data__.__accessed__[propertyName] = true;
                    return ProxyGenerator.getDefaultFieldValue(fieldType);
                }
            },
            set: function (value) {
                var proxy = ProxyGenerator.setupProxy(this);
                var currentValue = proxy.__data__.__current__[propertyName];
                if (currentValue === value) {
                    return;
                }
                proxy.__isDirty__ = true;
                proxy.__data__.__current__[propertyName] = value;
            }
        };
        var proxiedClass = Class;
        proxiedClass.__fieldMap__[propertyName] = propertyWrapper;
        proxiedClass.__fieldTypeMap__[propertyName] = fieldType;
        Object.defineProperty(proxiedClass, propertyName, propertyWrapper);
    };
    ProxyGenerator.setupEntityRelation = function (Class, propertyName, relationType, RelatedEntityClass) {
        // This references point to the object
        var propertyWrapper = {
            get: function () {
                var proxy = ProxyGenerator.setupProxy(this);
                if (proxy.__data__.__initialized__[propertyName]) {
                    return proxy.__data__.__current__[propertyName];
                }
                else {
                    proxy.__data__.__accessed__[propertyName] = true;
                    return ProxyGenerator.getDefaultRelationValue(relationType, RelatedEntityClass);
                }
            },
            set: function (value) {
                var proxy = ProxyGenerator.setupProxy(this);
                var currentValue = proxy.__data__.__current__[propertyName];
                if (currentValue === value) {
                    return;
                }
                proxy.__isDirty__ = true;
                proxy.__data__.__current__[propertyName] = value;
            }
        };
        var proxiedClass = Class;
        proxiedClass.__relationMap__[propertyName] = propertyWrapper;
        proxiedClass.__relationTypeMap__[propertyName] = relationType;
        Object.defineProperty(proxiedClass, propertyName, propertyWrapper);
    };
    ProxyGenerator.getDefaultFieldValue = function (fieldType) {
        switch (fieldType) {
            case querydsl_typescript_1.FieldType.BOOLEAN:
                return false;
            case querydsl_typescript_1.FieldType.DATE:
                return new Date(0);
            case querydsl_typescript_1.FieldType.NUMBER:
                return 0;
            case querydsl_typescript_1.FieldType.STRING:
                return '';
            default:
                throw "Unknown Field Type: " + fieldType;
        }
    };
    ProxyGenerator.getDefaultRelationValue = function (relationType, RelatedEntityClass) {
        switch (relationType) {
            case querydsl_typescript_1.RelationType.MANY_TO_ONE:
                var entity = new RelatedEntityClass();
                return entity;
            case querydsl_typescript_1.RelationType.ONE_TO_MANY:
                var entityArray = [];
                var memberEntity = new RelatedEntityClass();
                entityArray.push(memberEntity);
                return entityArray;
            default:
                throw "Unknown Relation Type " + relationType;
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
            __original__: {}
        };
        proxy.__proxied__ = true;
        return proxy;
    };
    return ProxyGenerator;
}());
exports.ProxyGenerator = ProxyGenerator;
//# sourceMappingURL=ProxyGenerator.js.map