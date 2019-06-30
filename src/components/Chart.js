import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Chart() {


  return <HighchartsReact highcharts={Highcharts} options={config} />;
}
