/* eslint-disable no-param-reassign */
import { get, set, forEach, last, isNumber } from 'lodash';
import moment from 'moment';
import { getChartConfig, GREEN, TEAL, CHART_HEIGHT } from './chartConfig';
import stations from './stations';
import metricConversion from './metrics';

const getFinalString = ({ lastX, lastY, units }) =>
  `<div style="position: relative;">
    <div style="background: ${TEAL}; opacity: .8; z-index: 10;border:0.5px white solid; 
          width: 100%; height: 100%; position: absolute"></div>
    <div style="z-index: 10000; position: absolute;margin: 0 3px;font-family:Montserrat;">
      <span class="c" style="font-weight:900;color:${GREEN}">${lastY}</span> 
      ${units} at ${moment(lastX).format('h:mm A')}
    </div>
    <div style="z-index: 10000;margin: 0 3px;font-family:Montserrat;">
      <span class="c" style="font-weight:900;color:${TEAL};">${lastY}</span> 
      ${units} at ${moment(lastX).format('h:mm A')}
    </div>
  </div>`;

const decimals = {
  DO: 1,
  PH: 1,
  SPCO: 0,
  TURB: 1,
  WTMP: 1,
};

const MIN_WIDTH = 800;

export default function getChartData({
  tabIndex,
  width,
  stationData,
  location,
}) {
  const station = stations[location];
  const key = station.params[tabIndex];
  const imageScale = width / 1250;
  const config = getChartConfig();
  const hasData = stationData[key];

  const topHeight = -210 * imageScale * imageScale;
  const bottomHeight = -75 * imageScale;

  set(config, ['chart', 'width'], width || MIN_WIDTH);

  const metric = metricConversion[key];
  const units = metric.unit;

  let rows = stationData[key] ? stationData[key].slice() : [];
  if (Array.isArray(rows) && metric.conversion) {
    rows = rows.map(row => [row[0], metric.conversion(row[1])]);
  }
  let max = get(rows, '0.1');
  let min = get(rows, '0.1');

  forEach(rows, row => {
    const newValue = get(row, '1', 0);
    max = Math.max(max, newValue);
    min = Math.min(min, newValue);
  });

  const lastX = get(last(rows), '0');
  let lastY = get(last(rows), '1') || 0;
  lastY = isNumber(decimals[key])
    ? lastY.toFixed(decimals[key])
    : lastY.toFixed(2);
  lastY = parseFloat(lastY);

  const finalString = getFinalString({ lastX, lastY, units });
  const isOffline =
    Math.abs(moment().valueOf() - lastX) >=
    moment.duration(6, 'hours').valueOf()
      ? moment(lastX).fromNow(true)
      : false;

  rows.pop();
  rows.push({
    marker: { fillColor: GREEN, radius: 6 },
    x: lastX,
    y: lastY,
  });
  const xAxisLabel = width > 1000 ? '%b %e' : '%e';
  const titleAlign = lastY < (max + min) / 2 ? topHeight : bottomHeight;

  const xAxisMin =
    location !== 'norriePoint'
      ? moment().startOf('day').subtract(2, 'days').valueOf()
      : moment().startOf('day').subtract(10, 'days').valueOf();
  const isOfflineOffset = titleAlign > -100 || width < 1000 ? 0 : 85;

  set(config, ['series', '0', 'data'], rows);
  set(config, ['yAxis', 'title', 'text'], units);
  set(config, ['yAxis', 'tickInterval'], key === 'PH' ? 0.2 : undefined);
  set(config, ['title', 'text'], finalString);
  set(config, ['title', 'y'], titleAlign);
  set(config, ['chart', 'animation'], false);
  set(config, ['plotOptions', 'series', 'animation'], false);
  // set(config, ['xAxis', 'min'], xAxisMin);
  set(config, ['xAxis', 'dateTimeLabelFormats', 'day'], xAxisLabel);

  return { config, isOffline, isOfflineOffset, hasData };
}
