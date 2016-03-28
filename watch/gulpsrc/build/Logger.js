/**
 * Created by Papa on 3/26/2016.
 */
"use strict";
var Logger = (function () {
    function Logger() {
    }
    Logger.prototype.error = function (message) {
        this.log('ERROR', message);
    };
    Logger.prototype.log = function (severity, message) {
        console.log(this.getNowStamp() + " [" + severity + "]: " + message);
    };
    Logger.prototype.getNowStamp = function () {
        var date = new Date();
        return this.getTimeStamp(date);
    };
    Logger.prototype.getTimeStamp = function (date) {
        return date.toISOString();
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map