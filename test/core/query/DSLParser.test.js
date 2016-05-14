/// <reference path="../../typings/tsd.d.ts"/>
"use strict";
/**
 * Created by Papa on 5/10/2016.
 */
var chai_1 = require('chai');
var DSLParser_1 = require("../../../src/core/query/DSLParser");
describe('test', function () {
    it('should do something', function () {
        console.log('test');
        var queryState = DSLParser_1.DSLParser.parse("\n\t\tWHERE\n\t\t\t\tc = d\n\t\t\ta = :b\n\t\t");
        chai_1.expect(true).to.be.equal(true);
    });
});
//# sourceMappingURL=DSLParser.test.js.map