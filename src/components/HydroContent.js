import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import sizeMe from 'react-sizeme';
import stationMetrics from 'utils/metrics';
import salt from 'assets/HRECOS_PANEL_SALT.png';
import dissolvedOxygen from 'assets/HRECOS_PANEL_DO.png';
import backgroundSource from 'assets/HRECOS_background_small.png';
import piermontDO from 'assets/HRECOS_PANEL_DO_PIERMONT.png';
import conductivity from 'assets/HRECOS_PANEL_COND.png';
import waterTemp from 'assets/HRECOS_PANEL_WATER_TEMP.png';
import turb from 'assets/HRECOS_PANEL_TURB.png';
import waterDepth from 'assets/HRECOS_PANEL_WATER_LEVEL.png';
import acidity from 'assets/HRECOS_PANEL_PH.png';
import backgroundPanel from 'assets/HRECOS_panel_background.png';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import getChartData from 'utils/chartData';
import Chart from './Chart';
import stations from '../utils/stations.json';
import { mapList } from './AboutStationCard';

const backgroundImages = {
  backgroundPanel,
  depthImage: waterDepth,
  doImage: dissolvedOxygen,
  phImage: acidity,
  piermontDO,
  saltImage: salt,
  spcoImage: conductivity,
  turbImage: turb,
  wtmpImage: waterTemp,
};

const imageList = Object.values(backgroundImages);

const useStyles = makeStyles(theme => ({
  backgroundImage: {
    // position: 'fixed',
    width: '100%',
  },
  chartWrapper: {
    position: 'absolute',
    top: '59vh',
  },
  imageWrapper: {
    position: 'absolute',
  },
  liveDataTitle: {
    color: '#e58030',
    fontFamily: 'Montserrate Black, sans-serif',
    fontSize: '24px',
    fontWeight: 800,
    marginLeft: '15%',
    marginTop: '-2%',
    position: 'absolute',
    zIndex: 100,
  },
  offlineWarning: {
    bottom: 100,
    color: 'yellow',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginRight: '15px',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    zIndex: 100,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    gridColumnStart: 2,
    gridRowEnd: 'span 2',
    gridRowStart: 1,
  },
}));


function HydroContent({size}) {
  // This pre-caches the background images.
  // The server used to host some of the displays has a very slow connection
  const imageRef = useRef({});
  useEffect(() => {
    setTimeout(() => {
      imageList.forEach((key, index) => {
        imageRef.current[index] = new Image();
        imageRef.current[index].src = imageList[index];
      });
    }, 2500);
  }, []);

  const classes = useStyles();
  // const scale = useSelector(state => state.scale);
  const tabIndex = useSelector(state => state.tabIndex);
  const location = useSelector(state => state.stationID);
  const paramKey = stations[location].params[tabIndex];
  const stationName = stations[location].title;
  const selectedParameter = stationMetrics[paramKey].param_nm;

  const stationData = useSelector(state => state.stationData);

  console.log('-----stationData', stationData)

  const scale = size.width / 1252;

  const height = 800 * scale;
  const width = 1250 * scale;

  const { config, isOffline } = getChartData({
    height, location, scale, stationData, tabIndex, width,
  });

  const offlineWarning = isOffline && (
    <div className={classes.offlineWarning}>
      <div>STATION CURRENTLY OFFLINE</div>
      <div>{`(${isOffline})`}</div>
    </div>
  );

  // These are an unfortunate result of using an image for content- there are ways around it,
  // but this is the simplest option.
  const chartOffset = scale * 600;
  const toolbarOffset = 48;
  const topOffset = chartOffset + toolbarOffset;

  const imgSrc = backgroundImages[`${paramKey.toLowerCase()}Image`] || backgroundPanel;


  return (
    <div className={classes.root}>
      <div className={classes.imageWrapper}>
        <img className={classes.backgroundImage} alt={`${paramKey}`} src={imgSrc} />
      </div>
      <div className={classes.chartWrapper}>
        <h3 className={classes.liveDataTitle}>
          {`Live ${stationName} ${selectedParameter} Data`}
        </h3>
        {offlineWarning}
        <HighchartsReact highcharts={Highcharts} options={config} />
      </div>
    </div>
  );
}


export default sizeMe()(HydroContent);
