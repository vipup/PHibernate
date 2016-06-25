/**
 * Created by Papa on 6/11/2016.
 */
"use strict";
class EntityUtils {
    static getObjectClassName(object) {
        if (typeof object != "object" || object === null) {
            throw `Not an object instance`;
        }
        return this.getClassName(object.constructor);
    }
    static getClassName(clazz) {
        if (typeof clazz != "function") {
            throw `Not a constructor function`;
        }
        let className = clazz['name'];
        // let className = /(\w+)\(/.exec(clazz.toString())[1];
        return className;
    }
}
exports.EntityUtils = EntityUtils;
//# sourceMappingURL=EntityUtils.js.map