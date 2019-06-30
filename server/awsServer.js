const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const station = require('./stationParams');
const soapService = require('./soapService');

const port = 3002;

// app.options('*', cors())
app.use(cors());
app.use('/api/station/:stationID', station.getStationData);
app.use('/api/soapStation/:stationID', soapService.getSoapData);
// app.use(require('connect-history-api-fallback')())
app.use(express.static('public', {
  maxage: '48h',
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

app.listen(port, () => {
  console.log('Example app listening on port 3002!');
});
