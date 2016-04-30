/**
 * Created by Papa on 4/17/2016.
 */
"use strict";
/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
function Id() {
    return function (targetObject, propertyKey) {
    };
}
exports.Id = Id;
/**
 * Annotates entities.
 *
 * @param entityConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Entity(entityConfiguration) {
    return function (constructor) {
    };
}
exports.Entity = Entity;
/**
 * Annotates collections of Entities in other entities.
 *
 * @param foreignKeyFieldName
 * @returns {function(any, string)}
 * @constructor
 */
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
/**
 * Annotates query function pointers (variables).
 *
 * @param queryDefinition
 * @returns {function(any, string)}
 * @constructor
 */
function Query(queryDefinition) {
    return function (targetObject, propertyKey) {
    };
}
exports.Query = Query;
//# sourceMappingURL=decorators.js.map