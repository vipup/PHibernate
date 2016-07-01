"use strict";
const querydsl_typescript_1 = require("querydsl-typescript");
const RecordState_1 = require("../../store/RecordState");
/**
 * Created by Papa on 5/15/2016.
 */
class ProxyGenerator {
    static setupEntityField(Class, propertyName, fieldType) {
        // This references point to the object
        let propertyWrapper = {
            get: function () {
                let proxy = ProxyGenerator.setupProxy(this);
                let state = proxy.__recordState__;
                if (state.data.initialized[propertyName]) {
                    return state.data.current[propertyName];
                }
                else {
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
        let proxiedClass = Class;
        proxiedClass.__fieldMap__[propertyName] = propertyWrapper;
        proxiedClass.__fieldTypeMap__[propertyName] = fieldType;
        Object.defineProperty(proxiedClass, propertyName, propertyWrapper);
    }
    static setupEntityRelation(Class, propertyName, relationType, RelatedEntityClass) {
        // This references point to the object
        let propertyWrapper = {
            get: function () {
                let proxy = ProxyGenerator.setupProxy(this);
                let state = proxy.__recordState__;
                if (state.data.initialized[propertyName]) {
                    return state.data.current[propertyName];
                }
                else {
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
        let proxiedClass = Class;
        proxiedClass.__relationMap__[propertyName] = propertyWrapper;
        proxiedClass.__relationTypeMap__[propertyName] = relationType;
        Object.defineProperty(proxiedClass, propertyName, propertyWrapper);
    }
    static getDefaultFieldValue(fieldType) {
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
                throw `Unknown Field Type: ${fieldType}`;
        }
    }
    static getDefaultRelationValue(relationType, RelatedEntityClass) {
        switch (relationType) {
            case querydsl_typescript_1.RelationType.MANY_TO_ONE:
                let entity = new RelatedEntityClass();
                return entity;
            case querydsl_typescript_1.RelationType.ONE_TO_MANY:
                let entityArray = [];
                let memberEntity = new RelatedEntityClass();
                entityArray.push(memberEntity);
                return entityArray;
            default:
                throw `Unknown Relation Type ${relationType}`;
        }
    }
    static setupProxy(entity) {
        let proxy = entity;
        let state = proxy.__recordState__;
        if (state) {
            state.proxied = true;
            return proxy;
        }
        state = new RecordState_1.RecordState();
        state.proxied = true;
        proxy.__recordState__ = state;
        return proxy;
    }
}
exports.ProxyGenerator = ProxyGenerator;
//# sourceMappingURL=ProxyGenerator.js.map