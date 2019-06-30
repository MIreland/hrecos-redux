export const weatherParams = [
  {
    getValue(data) {
      return '83.3%';
    },
    text: 'Humidity',
    key: 'humidity',
  },
  {
    getValue(data) {
      return '13.2 knots from NE (High Gust 21 knots)';
    },
    text: 'Wind',
    key: 'wind',
  },
  {
    getValue(data) {
      return '0 in';
    },
    text: 'Precipitation',
    key: 'precipitation',
  },
  {
    getValue(data) {
      return '34.1 °F';
    },
    text: 'Air Temperature',
    key: 'airTemp',
  },
  {
    getValue(data) {
      return '29.69 Hg';
    },
    text: 'Pressure',
    key: 'pressure',
  },
  {
    getValue(data) {
      return '41 °F';
    },
    superscript: '2',
    text: 'Dew Point',
    key: 'dewPoint',
  },
];

export default weatherParams;
