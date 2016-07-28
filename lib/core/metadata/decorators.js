/**
 * Created by Papa on 4/17/2016.
 */
"use strict";
exports.PH_PRIMARY_KEY = '__primaryKey__';
exports.PH_MANY_TO_ONE = '__ph_many_to_one__';
exports.PH_ONE_TO_MANY = '__ph_one_to_many__';
exports.PH_VISIBLE_FOR = '__ph_visible_for__';
exports.PH_EDITABLE_FOR = '__ph_editable_for__';
/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
function Id() {
    return function (targetObject, propertyKey) {
        if (targetObject[exports.PH_PRIMARY_KEY]) {
            throw `Cannot set primary key to '${propertyKey}', it is already set to '${targetObject[exports.PH_PRIMARY_KEY]}'`;
        }
        targetObject[exports.PH_PRIMARY_KEY] = propertyKey;
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
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Table(tableConfiguration) {
    return function (constructor) {
    };
}
exports.Table = Table;
/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function MappedSuperclass() {
    return function (constructor) {
    };
}
exports.MappedSuperclass = MappedSuperclass;
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
 * @param columnConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Column(columnConfiguration) {
    return function (targetObject, propertyKey) {
    };
}
exports.Column = Column;
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
/**
 * Annotates columns.
 *
 * @param columnConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function JoinColumn(joinColumnConfiguration) {
    return function (targetObject, propertyKey) {
    };
}
exports.JoinColumn = JoinColumn;
/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Transient() {
    return function (targetObject, propertyKey) {
    };
}
exports.Transient = Transient;
/**
 * Specifies a single-valued association to another entity class that has many-to-one multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/ManyToOne.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
function ManyToOne(elements) {
    return function (targetObject, propertyKey) {
        let manyToOne = targetObject[exports.PH_MANY_TO_ONE];
        if (!manyToOne) {
            manyToOne = {};
            targetObject[exports.PH_MANY_TO_ONE] = manyToOne;
        }
        manyToOne[propertyKey] = elements;
    };
}
exports.ManyToOne = ManyToOne;
/**
 * Specifies a many-valued association with one-to-many multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
function OneToMany(elements) {
    return function (targetObject, propertyKey) {
        let oneToMany = targetObject[exports.PH_ONE_TO_MANY];
        if (!oneToMany) {
            oneToMany = {};
            targetObject[exports.PH_ONE_TO_MANY] = oneToMany;
        }
        oneToMany[propertyKey] = elements;
    };
}
exports.OneToMany = OneToMany;
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
/**
 * Annotates query function pointers (variables).
 *
 * @param selectDefinition
 * @param fromWhereDefinition
 * @returns {function(any, string)}
 * @constructor
 */
function Query(entityClass, selectDefinition, fromWhereDefinition, paramsFactory) {
    return function (target, propertyKey) {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                throw `Not implemented yet`;
            },
            set: function (val) {
                throw `Cannot override '${propertyKey}' @Query annotated reference, please define a parameter function.`;
            }
        });
    };
}
exports.Query = Query;
//# sourceMappingURL=decorators.js.map