/**
 * Created by Papa on 6/28/2016.
 */
"use strict";
(function (CascadeType) {
    CascadeType[CascadeType["ALL"] = 0] = "ALL";
    CascadeType[CascadeType["DETACH"] = 1] = "DETACH";
    CascadeType[CascadeType["MERGE"] = 2] = "MERGE";
    CascadeType[CascadeType["PERSIST"] = 3] = "PERSIST";
    CascadeType[CascadeType["REFRESH"] = 4] = "REFRESH";
    CascadeType[CascadeType["REMOVE"] = 5] = "REMOVE"; // Cascade remove operation
})(exports.CascadeType || (exports.CascadeType = {}));
var CascadeType = exports.CascadeType;
(function (FetchType) {
    FetchType[FetchType["EAGER"] = 0] = "EAGER";
    FetchType[FetchType["LAZY"] = 1] = "LAZY"; // Defines that data can be lazily fetched.
})(exports.FetchType || (exports.FetchType = {}));
var FetchType = exports.FetchType;
//# sourceMappingURL=JPAApi.js.map