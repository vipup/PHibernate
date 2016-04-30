/**
 * Created by Papa on 4/17/2016.
 */
"use strict";
function Entity(entityConfiguration) {
    return function (constructor) {
    };
}
exports.Entity = Entity;
function ForeignKey(foreignKeyFieldName) {
    return function (targetObject, propertyKey) {
    };
}
exports.ForeignKey = ForeignKey;
function Repository(repositoryConfiguration) {
    return function (constructor) {
    };
}
exports.Repository = Repository;
function Query(queryDefinition) {
    return function (targetObject, propertyKey, descriptor) {
    };
}
exports.Query = Query;
//# sourceMappingURL=decorators.js.map