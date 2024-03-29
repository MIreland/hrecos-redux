/* eslint-disable quote-props,implicit-arrow-linebreak */
const express = require('express');
const Papa = require('papaparse');
const { get, forEach, memoize, map, findIndex, isFinite } = require('lodash');
const moment = require('moment-timezone');
const fetch = require('node-fetch');

const api = express.Router();
const NodeCache = require('node-cache');
const soap = require('soap');
const stations = require('../src/utils/stations.json');

const myCache = new NodeCache({ checkperiod: 60 * 2, stdTTL: 60 * 15 });

const DEBUG_LOG = process.env.DEBUG_LOG || false;

// Piermont: https://waterdata.usgs.gov/nwis/uv/?site_no=01376269&agency_cd=USGS&amp;

const METRIC_MAPPING = {
  '00010': 'WTMP',
  '00020': 'ATMP',
  '00045': 'RAIN',
  '00052': 'RHUM',
  '00095': 'SPCO',
  '00300': 'DO',
  '00301': 'DOPC',
  '00400': 'PH',
  32315: 'CHL',
  32321: 'FPC',
  62620: 'ELEV',
  63680: 'TURB',
  75969: 'BARO',
  82127: 'WSPD',
  90860: 'SALT',
};

const MARIST_TIME_SERIES = {
  291476: 'SALT',
  316638: 'SPCO',
  316639: 'WTMP',
  316640: 'TURB',
  316641: 'PH',
};

// const maristArray = ['243903', '246496', '32315', '32321', '243896', '107097', '243902', '243897'];

const SOAP_METRIC_MAPPING = {
  // Metrics listed at: http://cdmo.baruch.sc.edu/data/parameters.cfm
  ATemp: 'ATMP',
  BP: 'BARO',
  DO_mgl: 'DO',
  Depth: 'DEPTH',
  MaxWSpdT: 'GST',
  RH: 'RHUM',
  SpCond: 'SPCO',
  // DEWP,
  Temp: 'WTMP',
  TotPrcp: 'RAIN',
  Turb: 'TURB',
  WSpd: 'WSPD',
  Wdir: 'WD',
  pH: 'PH',
};

const memoizedTime = memoize(dateStr =>
  moment.tz(dateStr, 'YYYY-MM-DD HH:mm:ss', 'EST').valueOf());

function getStationData(station, res) {
  let { stationID } = station.params;
  stationID = stationID || 'piermont';
  const startDate = moment.utc().add(-3, 'days').format('YYYY-MM-DD');
  const endDate = moment.utc().format('YYYY-MM-DD');
  const stationStatus = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTd9ro6ylJ4LBECGlszV_UI9od-5MAC6W60iqpWB2HTZFjK5q5y0G1CMHVcNXL4IptubblYo-w7gDz/pub?gid=0&single=true&output=csv';

  fetch(stationStatus)
    .then(statusResponse => statusResponse.text())
    .then((status) => {
      const stationStatusDetails = Papa.parse(status, {
        dynamicTyping: true,
        header: true,
      }).data;

      // Norrie Point
      if (stationID === 'norriePoint') {
        const soapURL = 'https://cdmo.baruch.sc.edu/webservices2/requests.cfc?wsdl';

        // eslint-disable-next-line sort-keys-fix/sort-keys-fix
        const waterArgs = {
          maxdate: endDate,
          mindate: startDate,
          station_code: 'hudnpwq',
        };
        // eslint-disable-next-line sort-keys-fix/sort-keys-fix
        const atmosArgs = {
          maxdate: endDate,
          mindate: startDate,
          station_code: 'hudnpmet',
        };
        const dataMapping = { sourceUrl: soapURL, stationStatusDetails };

        soap.createClient(soapURL, (err, client) => {
          if (DEBUG_LOG && err) {
            console.log('Error creating client', err);
            return res.send({ soapClientError: err });
          }
          client.exportAllParamsDateRangeXMLNew(
            waterArgs,
            (soapErr, waterResult) => {
              if (DEBUG_LOG && soapErr) {
                console.log('Error retrieving water data', soapErr);
                return res.send({ waterClientError: soapErr });
              }

              client.exportAllParamsDateRangeXMLNew(
                atmosArgs,
                (soapWaterErr, atmosResult) => {
                  const results = [waterResult, atmosResult];
                  results.forEach((result) => {
                    const data = get(
                      result,
                      'exportAllParamsDateRangeXMLNewReturn.returnData.data',
                      [],
                    );
                    if (!data.reverse) {
                      dataMapping.error = data;
                      // 9999999
                      return;
                    }
                    try {
                      data.reverse().forEach((row) => {
                        const timeStamp = moment(
                          row.DateTimeStamp,
                          'MM/DD/YYYY HH:mm',
                        ).valueOf();
                        Object.keys(SOAP_METRIC_MAPPING).forEach((key) => {
                          if (!row[key]) {
                            return;
                          }
                          let parsedFloat = parseFloat(row[key]);
                          if (key === 'SpCond') {
                            parsedFloat *= 1000;
                          }
                          const newValue = [timeStamp, parsedFloat];
                          if (dataMapping[SOAP_METRIC_MAPPING[key]]) {
                            dataMapping[SOAP_METRIC_MAPPING[key]].push(
                              newValue,
                            );
                          } else {
                            dataMapping[SOAP_METRIC_MAPPING[key]] = [newValue];
                          }
                        });
                      });
                    } catch (e) {
                      dataMapping.error = e;
                    }
                  });
                  res.send(dataMapping);
                },
              );
            },
          );
        });
      } else {
        // https://waterdata.usgs.gov/nwis/uv?site_no=01359165

        const urlParams = Object.keys(METRIC_MAPPING)
          .map(key => `cb_${key}=on`)
          .join('&');
        const urlRoot = 'https://waterdata.usgs.gov/nwis/uv?';
        const isMarist = stationID === 'marist';
        const siteID = get(
          stations,
          `${stationID}.usgsKey`,
          stations.marist.usgsKey,
        );

        const url = `${urlRoot}${urlParams}&format=rdb&site_no=${siteID}&period=4&begin_date=${startDate}&end_date=${endDate}`;
        fetch(url)
          .then(usgsRes => usgsRes.text())
          .then((siteData) => {
            const csvString = siteData.slice(siteData.lastIndexOf('#') + 3);
            const values = Papa.parse(csvString, { dynamicTyping: true }).data;

            const [headers] = values.slice(0, 1);
            const rows = values.slice(2);
            const mappedResults = {
              sourceUrl: url,
              stationStatusDetails,
              values,
            };
            headers.forEach((header, headerIndex) => {
              if (header.includes('cd') || header.includes('239021')) {
                return;
              }

              const [timeSeries, paramCode] = header.split('_');

              let mappedHeader;
              if (isMarist && MARIST_TIME_SERIES[timeSeries]) {
                mappedHeader = MARIST_TIME_SERIES[timeSeries];
              } else {
                mappedHeader = METRIC_MAPPING[paramCode];
              }

              if (mappedHeader) {
                mappedResults[mappedHeader] = rows
                  .map((row, index) => {
                    if (!isFinite(row[headerIndex])) {
                      return index === 0
                        ? [memoizedTime(row[2]), 0, row[2]]
                        : [];
                    }
                    return [memoizedTime(row[2]), row[headerIndex], row[2]];
                  })
                  .filter(r => Boolean(r[0]) && Boolean(r[1]));
              }
            });
            res.send(mappedResults);
          });
      }
    })
    .catch((e) => {
      res.send({ e, error: 'error' });
    });
}

api.get('/', (req, res) => {
  const station = req.params.stationID;
  getStationData(station, res);
});

module.exports = api;
module.exports.getStationData = getStationData;
