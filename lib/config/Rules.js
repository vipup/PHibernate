/**
 * Created by Papa on 6/28/2016.
 */
"use strict";
(function (CascadeRule) {
    CascadeRule[CascadeRule["CASCADE_ALL"] = 0] = "CASCADE_ALL";
    CascadeRule[CascadeRule["CASCADE_MANY_TO_ONE"] = 1] = "CASCADE_MANY_TO_ONE";
    CascadeRule[CascadeRule["CASCADE_ONE_TO_MANY"] = 2] = "CASCADE_ONE_TO_MANY";
    CascadeRule[CascadeRule["DO_NOT_CASCADE"] = 3] = "DO_NOT_CASCADE";
})(exports.CascadeRule || (exports.CascadeRule = {}));
var CascadeRule = exports.CascadeRule;
//# sourceMappingURL=Rules.js.map