/// <reference path="typings/tsd.d.ts"/>

/**
 * Created by Papa on 5/13/2016.
 */

function importTest( //
    name,
    path //
) {
    describe(name, function() {
        require(path);
    });
}

describe('top', function () {
    importTest('DSLParser', './core/query/DSLParser.test');
});