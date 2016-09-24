"use strict";
const DeltaRecord_1 = require("../changeList/model/DeltaRecord");
(function (IdGeneration) {
    IdGeneration[IdGeneration["ENTITY_CHANGE_ID"] = 0] = "ENTITY_CHANGE_ID";
})(exports.IdGeneration || (exports.IdGeneration = {}));
var IdGeneration = exports.IdGeneration;
class UserTimeStampIdGenerator {
    generateChangeGroupId(changeGroup) {
        let cgIndexInMillisecond = this.getChangeGroupIndexInMillisecond();
        changeGroup.groupIndexInMillisecond = cgIndexInMillisecond;
        return DeltaRecord_1.DeltaRecord.getDRId(changeGroup, cgIndexInMillisecond);
    }
    generateEntityId(entity, entityChange) {
        // TODO: implement non change-based id generation
        return entityChange.id;
    }
    getChangeGroupIndexInMillisecond() {
        let nowTimeStamp = new Date().getTime();
        if (this.lastChangeGroupTimestamp != nowTimeStamp) {
            this.lastChangeGroupTimestamp = nowTimeStamp;
            this.lastChangeGroupIndexForTimeStamp = 1;
        }
        else {
            this.lastChangeGroupIndexForTimeStamp++;
        }
        return this.lastChangeGroupIndexForTimeStamp;
    }
    getIdType() {
        return 'string';
    }
}
exports.UserTimeStampIdGenerator = UserTimeStampIdGenerator;
function getIdGenerator(idGeneration) {
    switch (idGeneration) {
        case IdGeneration.ENTITY_CHANGE_ID:
            return new UserTimeStampIdGenerator();
        default:
            throw `Unsupported IdGeneration: ${idGeneration}`;
    }
}
exports.getIdGenerator = getIdGenerator;
//# sourceMappingURL=IdGenerator.js.map