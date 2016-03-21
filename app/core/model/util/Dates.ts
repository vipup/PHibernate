/**
 * Created by Papa on 3/14/2016.
 */


export function getStartOfDayDate():Date {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getCurrentDateTimestamp():string {
  return new Date().toJSON();
}

export function getCurrentQueriableTimeStamp():string {
  let date = new Date();
  let timestamp = `${date.getUTCFullYear()}_${date.getUTCMonth()}_${date.getUTCDate()}_${date.getUTCHours()}_${date.getUTCMinutes()}_${date.getUTCSeconds()}_${date.getUTCMilliseconds()}`;

  return timestamp;
}

