"use strict";
const PH_1 = require("../../config/PH");
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
function Transactional() {
    return function (target, methodName, methodDescriptor) {
        // save a reference to the original method
        // this way we keep the values currently in the
        // descriptor and don't overwrite what another
        // decorator might have done to the descriptor.
        var originalMethod = methodDescriptor.value;
        //editing the descriptor/value parameter
        methodDescriptor.value = function (...args) {
            /**
             var result;
             PH.entityManager.getLocalStore().wrapInTransaction(() => {
            // note usage of originalMethod here
                result = originalMethod.apply(this, args);
            });
             return result;*/
            /**
             return new Promise((resolve, reject) => {
                PH.entityManager.getLocalStore().wrapInTransaction(() => {
                    // note usage of originalMethod here
                    var promise = originalMethod.apply(this, args);
                    promise.then(resolve, reject);
                });
            });*/
            /**
             let result;
             PH.entityManager.getLocalStore().wrapInTransaction(() => {
                // note usage of originalMethod here
                result = originalMethod.apply(this, args);

                return result;
            });
             if (result instanceof Promise) {
                return new Promise((resolve, reject) => {
                    result.then(resolve, reject);
                });
            } else {
                return result;
            }
             */
            return PH_1.PH.entityManager.getLocalStore().wrapInTransaction(() => {
                // note usage of originalMethod here
                let result = originalMethod.apply(this, args);
                return result;
            });
        };
        // return edited descriptor as opposed to overwriting
        // the descriptor by returning a new descriptor
        return methodDescriptor;
    };
}
exports.Transactional = Transactional;
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