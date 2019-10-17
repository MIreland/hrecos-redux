const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const station = require('./stationParams');
const soapService = require('./soapService');

const port = process.env.PORT || 3000;

// app.options('*', cors())
app.use(cors());
app.use('/api/station/:stationID', station.getStationData);
app.use('/api/soapStation/:stationID', soapService.getSoapData);
// app.use(require('connect-history-api-fallback')())
app.use(express.static('build', {
  maxage: '48h',
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
app.get('/station*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!!!`);
});
