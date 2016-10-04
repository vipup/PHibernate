"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const querydsl_typescript_1 = require("querydsl-typescript");
const BooleanFieldChange_1 = require("./BooleanFieldChange");
const DateFieldChange_1 = require("./DateFieldChange");
const NumberFieldChange_1 = require("./NumberFieldChange");
const StringFieldChange_1 = require("./StringFieldChange");
const AbstractFieldChange_1 = require("./AbstractFieldChange");
const AbstractEntityChange_1 = require("./AbstractEntityChange");
let EntityChange = class EntityChange extends AbstractEntityChange_1.AbstractEntityChange {
    constructor() {
        super(...arguments);
        this.numberOfFieldsInEntity = 0;
        this.booleanFieldChanges = [];
        this.dateFieldChanges = [];
        this.numberFieldChanges = [];
        this.stringFieldChanges = [];
    }
    addNewFieldChange(fieldName, oldValue, newValue, field) {
        if (field instanceof querydsl_typescript_1.QBooleanField) {
            return this.addNewBooleanFieldChange(fieldName, oldValue, newValue);
        }
        else if (field instanceof querydsl_typescript_1.QDateField) {
            return this.addNewDateFieldChange(fieldName, oldValue, newValue);
        }
        else if (field instanceof querydsl_typescript_1.QNumberField) {
            return this.addNewNumberFieldChange(fieldName, oldValue, newValue);
        }
        else if (field instanceof querydsl_typescript_1.QStringField) {
            return this.addNewStringFieldChange(fieldName, oldValue, newValue);
        }
    }
    addNewBooleanFieldChange(fieldName, oldValue, newValue) {
        let booleanFieldChange = new BooleanFieldChange_1.BooleanFieldChange();
        let fieldChange = this.addNewFieldChangeInternal(fieldName, booleanFieldChange);
        fieldChange.oldValue = oldValue;
        fieldChange.newValue = newValue;
        this.booleanFieldChanges.push(fieldChange);
        return fieldChange;
    }
    addNewDateFieldChange(fieldName, oldValue, newValue) {
        let dateFieldChange = new DateFieldChange_1.DateFieldChange();
        let fieldChange = this.addNewFieldChangeInternal(fieldName, dateFieldChange);
        fieldChange.oldValue = oldValue;
        fieldChange.newValue = newValue;
        this.dateFieldChanges.push(fieldChange);
        return fieldChange;
    }
    addNewNumberFieldChange(fieldName, oldValue, newValue) {
        let numberFieldChange = new NumberFieldChange_1.NumberFieldChange();
        let fieldChange = this.addNewFieldChangeInternal(fieldName, numberFieldChange);
        fieldChange.oldValue = oldValue;
        fieldChange.newValue = newValue;
        this.numberFieldChanges.push(fieldChange);
        return fieldChange;
    }
    addNewStringFieldChange(fieldName, oldValue, newValue) {
        let stringFieldChange = new StringFieldChange_1.StringFieldChange();
        let fieldChange = this.addNewFieldChangeInternal(fieldName, stringFieldChange);
        fieldChange.oldValue = oldValue;
        fieldChange.newValue = newValue;
        this.stringFieldChanges.push(fieldChange);
        return fieldChange;
    }
    addNewFieldChangeInternal(fieldName, fieldChange) {
        fieldChange.createDateTime = this.createDateTime;
        fieldChange.createDeviceId = this.createDeviceId;
        fieldChange.createUserId = this.createUserId;
        fieldChange.entityChange = this;
        ++this.numberOfFieldsInEntity;
        fieldChange.propertyName = fieldName;
        fieldChange.id = AbstractFieldChange_1.AbstractFieldChange.getFieldChangeId(fieldName, this.entityChangeIdInGroup, this.createDeviceId, this.createDateTime, this.createUserId);
        return fieldChange;
    }
};
__decorate([
    querydsl_typescript_1.Column({ name: "CHANGED_ENTITY_ID" }),
    __metadata("design:type", String)
], EntityChange.prototype, "changedEntityId", void 0);
__decorate([
    querydsl_typescript_1.Column({ name: "NUM_FIELDS_IN_ENTITY" }),
    __metadata("design:type", Number)
], EntityChange.prototype, "numberOfFieldsInEntity", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'entityChange' }),
    __metadata("design:type", Array)
], EntityChange.prototype, "booleanFieldChanges", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'entityChange' }),
    __metadata("design:type", Array)
], EntityChange.prototype, "dateFieldChanges", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'entityChange' }),
    __metadata("design:type", Array)
], EntityChange.prototype, "numberFieldChanges", void 0);
__decorate([
    querydsl_typescript_1.OneToMany({ cascade: querydsl_typescript_1.CascadeType.ALL, mappedBy: 'entityChange' }),
    __metadata("design:type", Array)
], EntityChange.prototype, "stringFieldChanges", void 0);
EntityChange = __decorate([
    querydsl_typescript_1.Entity(),
    querydsl_typescript_1.Table({ name: "ENTITY_CHANGE" }),
    __metadata("design:paramtypes", [])
], EntityChange);
exports.EntityChange = EntityChange;
class StubEntityChange extends AbstractEntityChange_1.StubAbstractEntityChange {
    addNewFieldChange(fieldName, oldValue, newValue, field) {
        if (field instanceof querydsl_typescript_1.QBooleanField) {
            return this.addNewBooleanFieldChange(fieldName, oldValue, newValue);
        }
        else if (field instanceof querydsl_typescript_1.QDateField) {
            return this.addNewDateFieldChange(fieldName, oldValue, newValue);
        }
        else if (field instanceof querydsl_typescript_1.QNumberField) {
            return this.addNewNumberFieldChange(fieldName, oldValue, newValue);
        }
        else if (field instanceof querydsl_typescript_1.QStringField) {
            return this.addNewStringFieldChange(fieldName, oldValue, newValue);
        }
    }
    addNewBooleanFieldChange(fieldName, oldValue, newValue) {
        return new BooleanFieldChange_1.BooleanFieldChange();
    }
    addNewDateFieldChange(fieldName, oldValue, newValue) {
        return new DateFieldChange_1.DateFieldChange();
    }
    addNewNumberFieldChange(fieldName, oldValue, newValue) {
        return new NumberFieldChange_1.NumberFieldChange();
    }
    addNewStringFieldChange(fieldName, oldValue, newValue) {
        return new StringFieldChange_1.StringFieldChange();
    }
}
exports.StubEntityChange = StubEntityChange;
//# sourceMappingURL=EntityChange.js.map