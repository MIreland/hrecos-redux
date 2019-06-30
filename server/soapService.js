const express = require('express')
const Papa = require('papaparse')
const { get, forEach, memoize, map, findIndex } = require('lodash')
const moment = require('moment-timezone')
const fetch = require('node-fetch')
const unzip = require('unzip')
const api = express.Router()
var soap = require('soap')
const NodeCache = require('node-cache')
const myCache = new NodeCache({ checkperiod: 60 * 2, stdTTL: 60 * 15 })

const METRIC_MAPPING = { 'Depth':'DEPTH', 'DO_mgl':'DO', 'pH':'PH', 'SpCond':'SPCO', 'Turb':'TURB', 'Temp':'WTMP' }
const memoizedTime = memoize((dateStr) => moment.utc(dateStr, 'YYYY-MM-DD HH:mm:ss').valueOf())

// https://cdmo.baruch.sc.edu/webservices.cfm

function getSoapData (station, res) {
  const { hydroId, weatherId } = station.params
  const yesterday = moment.utc().add(-3, 'days').format('YYYY-MM-DD')
  const today = moment.utc().format('YYYY-MM-DD')
  console.log('-------------------------')
  const site = hydroId || '01359165'
  var url = 'http://cdmo.baruch.sc.edu/webservices2/requests.cfc?wsdl'
  var args = { name: 'value' }
  soap.createClient(url, function (err, client) {
    client.exportStationCodesXMLNew(args, function (err, result) {
      console.log('result', result)
    })
  })

  res.send({ 'test': test2 })
}

api.get('/', function (req, res) {
  const station = req.params.stationId
  console.log('stationsss:', req.params)
  getSoapData(station, res)
})

const NORRIE_POINT = [{
  'attributes': { 'count': '342' },
  'NERR_Site_ID': 'hud',
  'Station_Code': 'hudnpwq',
  'Station_Name': 'Norrie Point',
  'Lat_Long': '41° 49\' 54 N, 73° 56\' 32 W',
  'Latitude': '41.83167',
  'Longitude': '73.94194',
  'Status': 'Active',
  'Active_Dates': 'Jan 2018-',
  'State': 'NY',
  'Reserve_Name': 'Hudson River',
  'Params_Reported': 'Temp,SpCond,Sal,DO_pct,DO_mgl,Depth,pH,Turb,ChlFluor',
  'Real_Time': 'R'
}, {
  'attributes': { 'count': '343' },
  'NERR_Site_ID': 'hud',
  'Station_Code': 'hudnpmet',
  'Station_Name': 'Norrie Point',
  'Lat_Long': '41° 49\' 53 N, 73° 56\' 32 W',
  'Latitude': '41.83139',
  'Longitude': '73.94222',
  'Status': 'Active',
  'Active_Dates': 'Jan 2018-',
  'State': 'NY',
  'Reserve_Name': 'Hudson River',
  'Params_Reported': 'ATemp,RH,BP,WSpd,MaxWSpd,MaxWSpdT,Wdir,SDWDir,TotPrcp,TotPAR,CumPrcp',
  'Real_Time': 'R'
}]

module.exports = api
module.exports.getSoapData = getSoapData
