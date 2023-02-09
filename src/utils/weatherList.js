export const weatherParams = [
  {
    getValue(data) {
      return '83.3%';
    },
    key: 'humidity',
    text: 'Humidity',
  },
  {
    getValue(data) {
      return '13.2 knots from NE (High Gust 21 knots)';
    },
    key: 'wind',
    text: 'Wind',
  },
  {
    getValue(data) {
      return '0 in';
    },
    key: 'precipitation',
    text: 'Precipitation',
  },
  {
    getValue(data) {
      return '34.1 °F';
    },
    key: 'airTemp',
    text: 'Air Temperature',
  },
  {
    getValue(data) {
      return '29.69 Hg';
    },
    key: 'pressure',
    text: 'Pressure',
  },
  {
    getValue(data) {
      return '41 °F';
    },
    key: 'dewPoint',
    superscript: '2',
    text: 'Dew Point',
  },
];

export default weatherParams;
