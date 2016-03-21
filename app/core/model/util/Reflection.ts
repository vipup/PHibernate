/**
 * Created by Papa on 3/17/2016.
 */

export module reflection {
  
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;

  export function getFunctionParamNames( func ) {
    // var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    // var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    // if(result === null)
    //   result = [];
    // return result;

    return func.toString()
      .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '')
      .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
      .split(/,/);
  }

  export function getClassName(
    ClassObject
  ):string {
    let constructorAsString = ClassObject.constructor.toString();

    let parameterListStartIndex = constructorAsString.indexOf('(');
    let ClassName
      // = EntityClass.constructor.name;
      = constructorAsString.substring(9, parameterListStartIndex);

    console.log('ClassName: ' + ClassName);

    return ClassName;
  }

}
