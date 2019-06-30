/* eslint-disable no-param-reassign */
import React from 'react';
import { get, isNumber, last } from 'lodash';
import moment from 'moment';

export function formattedWeather(weather) {
  if (!weather || !weather.RAIN) return {};
  const {
    BARO, DEWP, RAIN, RHUM, ATMP, GST, WSPD, WD,
  } = weather;

  const windAngle = get(last(WD), '1');
  const arrayIndex = parseInt((windAngle / 22.5) + 0.5, 10);
  const directionArray = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE',
    'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const windDirection = directionArray[arrayIndex];
  const time = get(last(RAIN), '0') || get(last(BARO), '0') || get(last(DEWP), '0');
  return {
    airTemp: ATMP ? get(last(ATMP), '1') * 9 / 5 + 32 : false,
    dewPoint: DEWP ? get(last(DEWP), '1') * 9 / 5 + 32 : false,
    gust: get(last(GST), '1') * 2.23,
    humidity: get(last(RHUM), '1'),
    pressure: get(last(BARO), '1'),
    rain: get(last(RAIN), '1'),
    time: moment(time).format('MM/DD h:mm A'),
    wind: get(last(WSPD), '1') * 2.23,
    windDirection,
  };
}

export function createWeather({
  airTemp, wind, windDirection, dewPoint, rain, humidity, pressure,
}, stationName) {
  let direction = windDirection;
  const missingValue = '- -';

  airTemp = isNumber(airTemp) ? airTemp.toFixed(1) : missingValue;
  dewPoint = isNumber(dewPoint) ? dewPoint.toFixed(1) : '--';
  humidity = isNumber(humidity) ? humidity.toFixed(1) : missingValue;
  rain = isNumber(rain) ? rain.toFixed(2) : '--';
  wind = isNumber(wind) ? wind.toFixed(1) : '--';
  pressure = isNumber(pressure) ? pressure.toFixed(0) : '--';
  direction = direction ? `from ${direction}` : '';

  return (
    <React.Fragment>
    / Air Temperature
      {' '}
      <strong>
        {airTemp}
        {' '}
F
      </strong>
  / Dew Point
      {' '}
      <strong>
        {dewPoint}
        {' '}
F
      </strong>
  / Humidity
      {' '}
      <strong>
        {humidity}
%
      </strong>
  / 24-hr rain
      {' '}
      <strong>
        {rain}
        {' '}
in
      </strong>
  / Wind
      {' '}
      <strong>
        {wind}
        {' '}
knots
        {' '}
        {direction}
      </strong>
      {stationName !== 'pier84' && (
      <React.Fragment>
/ Pressure
        <strong>
          {pressure}
          {' '}
mbars
        </strong>
      </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default {
  createWeather,
  formattedWeather,
};
