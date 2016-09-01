"use strict";
exports.PH_VISIBLE_FOR = '__ph_visible_for__';
exports.PH_EDITABLE_FOR = '__ph_editable_for__';
/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function SequenceGenerator(sequenceGeneratorConfiguration) {
    return function (constructor) {
    };
}
exports.SequenceGenerator = SequenceGenerator;
/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function GeneratedValue(generatedValueConfiguration) {
    return function (targetObject, propertyKey) {
    };
}
exports.GeneratedValue = GeneratedValue;
/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Access(accessType) {
    return function (targetObject, propertyKey) {
    };
}
exports.Access = Access;
function VisibleFor(elements) {
    return function (targetObject, propertyKey) {
        let visibleForMap = targetObject[exports.PH_VISIBLE_FOR];
        if (!visibleForMap) {
            visibleForMap = {};
            targetObject[exports.PH_VISIBLE_FOR] = visibleForMap;
        }
        visibleForMap[propertyKey] = elements;
    };
}
exports.VisibleFor = VisibleFor;
function EditableFor(elements) {
    return function (targetObject, propertyKey) {
        let editableForMap = targetObject[exports.PH_EDITABLE_FOR];
        if (!editableForMap) {
            editableForMap = {};
            targetObject[exports.PH_EDITABLE_FOR] = editableForMap;
        }
        editableForMap[propertyKey] = elements;
    };
}
exports.EditableFor = EditableFor;
function Repository(repositoryConfiguration) {
    return function (constructor) {
    };
}
exports.Repository = Repository;
//# sourceMappingURL=decorators.js.map