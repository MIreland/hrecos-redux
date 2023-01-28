const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const station = require('./stationParams');

console.log('initializing server');
const port = process.env.PORT || 3000;

// app.options('*', cors())
app.use(cors());
app.use('/api/station/:stationID', station.getStationData);
// app.use(require('connect-history-api-fallback')())
app.use(
  express.static('build', {
    maxage: '48h',
  }),
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
app.get('/station*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
app.get('/embedded*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!!!`);
});
