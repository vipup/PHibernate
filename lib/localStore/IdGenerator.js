"use strict";
/**
 * Created by Papa on 9/2/2016.
 */
const UserUtils_1 = require("../shared/UserUtils");
(function (IdGeneration) {
    IdGeneration[IdGeneration["USER_TIMESTAMP"] = 0] = "USER_TIMESTAMP";
})(exports.IdGeneration || (exports.IdGeneration = {}));
var IdGeneration = exports.IdGeneration;
class UserTimeStampIdGenerator {
    generateId(entityClass) {
        let nowTimeStamp = new Date().getTime();
        let userId = UserUtils_1.UserUtils.getUserId();
        if (this.lastTimestamp != nowTimeStamp) {
            this.lastTimestamp = nowTimeStamp;
            this.lastIdForTimeStamp = 1;
        }
        else {
            this.lastIdForTimeStamp++;
        }
        return `${userId}_${nowTimeStamp}_${this.lastIdForTimeStamp}`;
    }
    getIdType() {
        return 'string';
    }
}
exports.UserTimeStampIdGenerator = UserTimeStampIdGenerator;
function getIdGenerator(idGeneration) {
    switch (idGeneration) {
        case IdGeneration.USER_TIMESTAMP:
            return new UserTimeStampIdGenerator();
        default:
            throw `Unsupported IdGeneration: ${idGeneration}`;
    }
}
exports.getIdGenerator = getIdGenerator;
//# sourceMappingURL=IdGenerator.js.map