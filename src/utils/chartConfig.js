export const WHITE = '#ffffff';
export const ORANGE = '#e58030';
export const GREEN = '#04ca01';
export const TEAL = '#4084a7';
export const CHART_HEIGHT = 280;

export const getChartConfig = (height) => JSON.parse(JSON.stringify({
  chart: {
    backgroundColor: 'transparent',
    height,
    legend: {
      enabled: false,
    },
    spacingRight: 30,
    type: 'line',
  },
  credits: { enabled: false },
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      animation: false,
      color: GREEN,
      lineWidth: 0.5,
      marker: {
        fillColor: ORANGE,
        radius: 3.5,
      },
    },
  },
  series: [{
    color: '#007465',
    data: [],
    marker: { enabled: true },
    regression: true,
  }],
  title: {
    align: 'right',
    floating: true,
    style: {
      color: WHITE,
      fontFamily: 'Montserrate Light',
      fontSize: '24px',
    },
    text: '',
    useHTML: true,
    verticalAlign: 'bottom',
    x: 10,
    y: -75,
  },
  xAxis: {
    dateTimeLabelFormats: {
      day: '%b %e',
      hour: '%l %p',
    },
    endOnTick: true,
    gridLineColor: WHITE,
    gridLineWidth: 1,
    labels: {
      formatter() {
        if (this.isFirst) {
          this.chart.firstValue = this.value;
        }
        const dailyInterval = ((this.chart.firstValue - this.value) / (3600 * 1000)) % 24 === 0;
        const fontSize = dailyInterval ? '2rem' : '1.25rem';
        return `<span style="font-size:${fontSize}">${this.axis.defaultLabelFormatter.call(this)}</span>`;
      },
      style: {
        color: WHITE,
        fontFamily: 'Montserrate Light',
        fontSize: '1.75rem',
      },
    },
    // min,
    minRange: 3600 * 1000 * 24 * 3,
    minTickInterval: 24 * 3600 * 1000, // one day
    minorTickWidth: 12,
    tickInterval: 6 * 3600 * 1000,
    title: {
      style: {
        color: WHITE,
        fontFamily: 'Montserrate Light',
        fontSize: '2.5rem',
        fontWeight: 'bold',
      },
    },
    type: 'datetime',
    visible: true,
  },
  yAxis: {
    endOnTick: true,
    gridLineColor: WHITE,
    gridLineWidth: 1,
    labels: {
      enabled: true,
      style: {
        color: WHITE,
        fontFamily: 'Montserrate Light',
      },
    },
    title: {
      style: {
        color: WHITE,
        fontFamily: 'Montserrate Light',
        fontSize: '2.2rem',
      },
    },
    visible: true,
  },
}));

export default getChartConfig;
