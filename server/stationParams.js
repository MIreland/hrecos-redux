/* eslint-disable quote-props */
const express = require('express');
const Papa = require('papaparse');
const {
  get, forEach, memoize, map, findIndex,
} = require('lodash');
const moment = require('moment-timezone');
const stations = require('../src/utils/stations.json');
const fetch = require('node-fetch');
const unzip = require('unzip');

const api = express.Router();
const NodeCache = require('node-cache');
const soap = require('soap');

const myCache = new NodeCache({ checkperiod: 60 * 2, stdTTL: 60 * 15 });

// Piermont: https://waterdata.usgs.gov/nwis/uv/?site_no=01376269&agency_cd=USGS&amp;


const METRIC_MAPPING = {
  '63680': 'TURB',
  '00300': 'DO',
  '00301': 'DOPC',
  '00400': 'PH',
  '90860': 'SALT',
  '00095': 'SPCO',
  '00010': 'WTMP',
  '00020': 'ATMP',
  '75969': 'BARO',
  '00045': 'RAIN',
  '82127': 'WSPD',
  '62620': 'ELEV',
  '00052': 'RHUM',
};

const SOAP_METRIC_MAPPING = {
  // Metrics listed at: http://cdmo.baruch.sc.edu/data/parameters.cfm
  Depth: 'DEPTH',
  DO_mgl: 'DO',
  pH: 'PH',
  SpCond: 'SPCO',
  Turb: 'TURB',
  Temp: 'WTMP',
  BP: 'BARO',
  // DEWP,
  TotPrcp: 'RAIN',
  RH: 'RHUM',
  ATemp: 'ATMP',
  MaxWSpdT: 'GST',
  WSpd: 'WSPD',
  Wdir: 'WD',
};
const memoizedTime = memoize(dateStr => moment.tz(dateStr, 'YYYY-MM-DD HH:mm:ss', 'America/New_York').valueOf());

function getStationData(station, res) {
  let { stationID } = station.params;
  stationID = stationID || 'piermont';
  const startDate = moment.utc().add(-3, 'days').format('YYYY-MM-DD');
  const endDate = moment.utc().format('YYYY-MM-DD');
  const stationStatus = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTd9ro6ylJ4LBECGlszV_UI9od-5MAC6W60iqpWB2HTZFjK5q5y0G1CMHVcNXL4IptubblYo-w7gDz/pub?gid=0&single=true&output=csv';

  fetch(stationStatus).then(statusResponse => statusResponse.text()).then((status) => {
    const stationStatusDetails = Papa.parse(status, { header: true, dynamicTyping: true }).data;


    // Norrie Point
    if (stationID === 'norriePoint') {
      const soapURL = 'http://cdmo.baruch.sc.edu/webservices2/requests.cfc?wsdl';

      const waterArgs = { station_code: 'hudnpwq', records: 500 };
      const atmosArgs = { station_code: 'hudnpmet', records: 500 };
      const dataMapping = { stationStatusDetails, sourceUrl: soapURL };

      soap.createClient(soapURL, (err, client) => {
        client.exportAllParamsXMLNew(waterArgs, (soapErr, waterResult) => {
          client.exportAllParamsXMLNew(atmosArgs, (soapWaterErr, atmosResult) => {
            [waterResult, atmosResult].forEach((result) => {
              const data = get(result, 'exportAllParamsXMLNewReturn.returnData.data', {});
              data.reverse().forEach((row) => {
                const timeStamp = moment(row.DateTimeStamp, 'MM/DD/YYYY HH:mm').valueOf();
                Object.keys(SOAP_METRIC_MAPPING).forEach((key) => {
                  if (!row[key]) { return; }
                  const newValue = [timeStamp, parseFloat(row[key])];
                  if (dataMapping[SOAP_METRIC_MAPPING[key]]) {
                    dataMapping[SOAP_METRIC_MAPPING[key]].push(newValue);
                  } else {
                    dataMapping[SOAP_METRIC_MAPPING[key]] = [newValue];
                  }
                });
              });
            });
            res.send(dataMapping);
          });
        });
      });
    } else {
    // https://waterdata.usgs.gov/nwis/uv?site_no=01359165

      const urlParams = Object.keys(METRIC_MAPPING).map(key => `cb_${key}=on`).join('&');
      const urlRoot = 'https://waterdata.usgs.gov/nwis/uv?';
      const isMarist = stationID === 'marist';

      const siteID = stations[stationID].usgsKey;

      const url = `${urlRoot}${urlParams}&format=rdb&site_no=${siteID}&period=4&begin_date=${startDate}&end_date=${endDate}`;

      fetch(url).then(usgsRes => usgsRes.text()).then((siteData) => {

        const csvString = siteData.slice(siteData.lastIndexOf('#') + 3);
        const values = Papa.parse(csvString, { dynamicTyping: true }).data;
        const [headers] = values.slice(0, 1);
        const rows = values.slice(2);
        const mappedResults = { stationStatusDetails, sourceUrl: url, values };
        headers.forEach((header, headerIndex) => {
          if (header.includes('cd') || header.includes('239021')) {
            return;
          }
          const maristArray = ['243903', '246496', '243896', '107097', '243902', '243897'];
          const headerString = header.slice(header.indexOf('_') + 1);
          if (isMarist && !maristArray.find(param => header.includes(param))) {
            return;
          }

          const mappedHeader = METRIC_MAPPING[headerString];
          if (mappedHeader) {
            mappedResults[mappedHeader] = rows.map(row => (
              [memoizedTime(row[2]), row[headerIndex], row[2]]
            )).filter(r => Boolean(r[0]) && Boolean(r[1]));
          }
        });
        res.send(mappedResults);
      });
    }
  }).catch((e) => {
    console.log('e', e)
    res.send({ error: 'error', e });
  });
}

api.get('/', (req, res) => {
  const station = req.params.stationID;
  getStationData(station, res);
});

module.exports = api;
module.exports.getStationData = getStationData;
