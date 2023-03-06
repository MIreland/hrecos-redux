/* eslint-disable no-param-reassign */
import { get, set, forEach, last, isNumber } from 'lodash';
import React from 'react';
import moment from 'moment';
import {
  getChartConfig,
  GREEN,
  CHART_HEIGHT,
  FULL_SIZE_CHART_HEIGHT,
  LINE_LIGHT_COLOR,
  LINE_DARK_COLOR,
} from './chartConfig';
import stations from './stations';
import metricConversion from './metrics';

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
  height,
  fullSizeChart,
  stationData,
  location,
}) {
  const station = stations[location];
  const key = station.params[tabIndex];
  const config = getChartConfig();
  const hasData = stationData[key];

  set(config, ['chart', 'width'], width || MIN_WIDTH);
  // console.log('width', width);
  const metric = metricConversion[key];
  const units = metric.unit;

  let rows = stationData[key] ? stationData[key].slice() : [];
  if (Array.isArray(rows) && metric.conversion) {
    rows = rows.map(row => [row[0], metric.conversion(row[1])]);
  }
  // let max = get(rows, '0.1');
  // let min = get(rows, '0.1');

  // forEach(rows, row => {
  //   const newValue = get(row, '1', 0);
  //   max = Math.max(max, newValue);
  //   min = Math.min(min, newValue);
  // });

  const lastX = get(last(rows), '0');
  let lastY = get(last(rows), '1') || 0;
  lastY = isNumber(decimals[key])
    ? lastY.toFixed(decimals[key])
    : lastY.toFixed(2);
  lastY = parseFloat(lastY);

  const isOffline = Math.abs(moment().valueOf() - lastX)
    >= moment.duration(6, 'hours').valueOf()
    ? moment(lastX).fromNow(true)
    : false;

  // rows.pop();
  // rows.push({
  //   marker: { fillColor: GREEN, radius: 6 },
  //   x: lastX,
  //   y: lastY,
  // });
  const xAxisLabel = width > 1000 ? '%b %eth' : '%eth';
  // const titleAlign = lastY < (max + min) / 2 ? topHeight : bottomHeight;

  // const isOfflineOffset = titleAlign > -100 || width < 1000 ? 0 : 85;

  const seriesColor = LINE_LIGHT_COLOR;

  set(config, ['plotOptions', 'series', 'color'], seriesColor);
  set(config, ['plotOptions', 'series', 'marker', 'fillColor'], seriesColor);

  set(config, ['series', '0', 'name'], metric.param_nm);
  set(config, ['series', '0', 'data'], rows);

  let yAxisTitle = metric.param_nm.replace(
    'Conductivity',
    'Specific Conductivity',
  );
  if (metric.param_code === 'PH') {
    yAxisTitle = 'pH';
  }

  set(config, ['yAxis', 'title', 'text'], `${yAxisTitle} (${units})`);

  const yLabelFormat = `{value:.${metric.decimals}f}`;

  set(config, ['yAxis', 'labels', 'format'], yLabelFormat);

  set(config, ['yAxis', 'tickInterval'], key === 'PH' ? 0.2 : undefined);
  // set(config, ['title', 'text'], finalString);
  // set(config, ['title', 'y'], titleAlign);
  set(config, ['chart', 'animation'], false);
  set(config, ['plotOptions', 'series', 'animation'], false);
  // set(config, ['xAxis', 'min'], xAxisMin);
  set(config, ['xAxis', 'dateTimeLabelFormats', 'day'], xAxisLabel);
  set(config, ['xAxis', 'title', 'text'], 'Date/Time');
  // set(config, ['xAxis', 'title', 'text'],  'Date/Time');

  set(config, ['tooltip', 'formatter'], function () {
    const localDate = new Date(this.x);
    const time = localDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const day = localDate.toLocaleTimeString([], {
      day: '2-digit',
      month: 'short',
    });
    return `<b>${this.series.name}:</b> ${this.y.toLocaleString('en-US', {
      maximumFractionDigits: metric.decimals,
      minimumFractionDigits: metric.decimals,
    })} ${metric.unit} at ${time} on ${day}`;
  });

  // set(config, ['xAxis', 'labels', 'formatter'], function () {
  //  console.log(this);
  //   const localDate = new Date(this.pos);
  //
  //
  //   return <span>{localDate.toLocaleTimeString()}</span>;
  // });

  const minHeight = fullSizeChart ? FULL_SIZE_CHART_HEIGHT : CHART_HEIGHT;
  const chartHeight = fullSizeChart
    ? Math.max(height - 25 || minHeight)
    : height * 0.3;
  set(config, ['chart', 'height'], chartHeight);

  return {
    config,
    hasData,
    isOffline,
    // isOfflineOffset,
  };
}
