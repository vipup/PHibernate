/**
 * Created by Papa on 3/17/2016.
 */

export module strings {

  export function capitalizeFirstLetter( string ) {
    return string && string.charAt(0).toUpperCase() + string.slice(1);
  }

  export function endsWith(
    str:string,
    suffix:string
  ):boolean {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

}
