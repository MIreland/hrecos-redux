import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { useSelector } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useDimensions from 'react-cool-dimensions';
import PropTypes from 'prop-types';
import stationMetrics from '../utils/metrics';
import salt from '../assets/HRECOS_PANEL_SALT.png';
import chlorophyll from '../assets/backgrounds/ab_chl_all.png';
import phycocyan from '../assets/backgrounds/ab_phyco_all.png';
import dissolvedOxygen from '../assets/HRECOS_PANEL_DO.png';
// import backgroundSource from '../assets/HRECOS_background_small.png';
import getChartData from '../utils/updateChartConfig';
import piermontDO from '../assets/HRECOS_PANEL_DO_PIERMONT.png';
import conductivity from '../assets/HRECOS_PANEL_COND.png';
import waterTemp from '../assets/HRECOS_PANEL_WATER_TEMP.png';
import turb from '../assets/HRECOS_PANEL_TURB.png';
import waterDepth from '../assets/HRECOS_PANEL_WATER_LEVEL.png';
import acidity from '../assets/HRECOS_PANEL_PH.png';
import backgroundPanel from '../assets/HRECOS_background.png';
import extendedBackground from '../assets/HRECOS_background_extend_1.png';
import extendedChlorophyl from '../assets/backgrounds/ab_bg.jpg';
import stations from '../utils/stations.json';

const backgroundImages = {
  backgroundPanel,
  chlImage: chlorophyll,
  depthImage: waterDepth,
  doImage: dissolvedOxygen,
  fpcImage: phycocyan,
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
    height: '100%',
    width: '100%',
  },
  chartWrapper: {
    '& .highcharts-xaxis-grid': {
      color: 'red',
      'stroke-width': 12,
    },
    bottom: 0,
    position: 'absolute',
  },
  fullSizeChart: {
    height: '100%',
  },
  liveDataTitle: {
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    fontWeight: 800,
    marginBottom: -5,
    marginLeft: '15%',
    marginTop: 15,
    zIndex: 100,
  },
  offlineWarning: {
    bottom: 100,
    color: 'yellow',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginRight: '15px',
    minWidth: 400,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    zIndex: 100,
  },
  root: {
    backgroundColor: 'rgb(56, 125, 159)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',

    gridTemplateAreas: `
      'imageContent'
      'chartContent'
    `,

    minHeight: 600,
    // flexGrow: 1,
    // gridColumnStart: 2,
    // gridRowEnd: 'span 2',
    // gridRowStart: 1,
    // gridTemplateRows: '3fr 2fr',
    position: 'relative',
  },
}));

function HydroContent({ failedToLoadData, isLoading, fullSizeChart }) {
  const [chartHeight, setChartHeight] = React.useState(0);
  const [chartWidth, setChartWidth] = React.useState(0);

  const backgroundSize = 'contain';
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

  const { observe, unobserve, width, height, entry } = useDimensions({
    onResize: ({ observe, unobserve, width, height, entry }) => {
      // Triggered whenever the size of the target is changed...

      // unobserve(); // To stop observing the current target element
      // observe(); // To re-start observing the current target element
      if (chartWidth !== width) {
        setChartHeight(height);
        setChartWidth(width);
      }
    },
  });

  const classes = useStyles();
  // const scale = useSelector(state => state.scale);
  const tabIndex = useSelector(state => state.tabIndex);
  const location = useSelector(state => state.stationID);
  const paramKey = stations[location].params[tabIndex] || stations[location].params[0];
  const stationName = stations[location].title;
  const selectedParameter = stationMetrics[paramKey].param_nm;

  const stationData = useSelector(state => state.stationData);

  const { config, isOffline, hasData } = getChartData({
    fullSizeChart,
    height: chartHeight,
    location,
    stationData,
    tabIndex,
    width: chartWidth,
  });

  const offlineWarning = isOffline && (
    <div className={classes.offlineWarning}>
      <div>STATION CURRENTLY OFFLINE</div>
      <div>{`(${isOffline})`}</div>
    </div>
  );

  const loadingString = isLoading ? '(loading)' : '';

  const failedToLoad = failedToLoadData && (
    <div className={classes.offlineWarning}>
      <div>FAILED TO LOAD DATA</div>
    </div>
  );

  let imgSrc = backgroundImages[`${paramKey.toLowerCase()}Image`];
  if (!imgSrc || fullSizeChart) {
    imgSrc = backgroundPanel;
  }

  console.log('paramKey', paramKey);
  const isAlgae = ['CHL', 'FPC'].includes(paramKey);
  const backgroundExtension = isAlgae ? extendedChlorophyl : extendedBackground;

  return (
    <div
      className={`${classes.root} hydro-wrapper ${
        fullSizeChart ? classes.fullHeightChart : ''
      }`}
      ref={observe}
      key={imgSrc}
      style={{
        backgroundImage: `url(${backgroundExtension})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div
        className="hydro-update"
        style={{
          backgroundImage: !fullSizeChart && `url(${imgSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize,
          height: isAlgae ? '65%' : '100%',
          width: '100%',
        }}
      >
        {/* <div className={`hydro-content ${classes.imageWrapper}`}> */}
        {/*  <img */}
        {/*    className={classes.backgroundImage} */}
        {/*    alt={`${paramKey}`} */}
        {/*    src={imgSrc} */}
        {/*  /> */}
        {/* </div> */}
        <div
          className={`${fullSizeChart && classes.fullSizeChart}  ${
            classes.chartWrapper
          }`}
          key={width}
        >
          {!failedToLoad && (
            <h3 className={classes.liveDataTitle}>
              {`Live ${stationName} ${selectedParameter} Data ${loadingString}`}
            </h3>
          )}
          {offlineWarning}
          {failedToLoad}
          {!failedToLoad && (
            <HighchartsReact
              highcharts={Highcharts}
              options={config}
              immutable
            />
          )}
        </div>
      </div>
    </div>
  );
}

HydroContent.propTypes = {
  failedToLoadData: PropTypes.bool.isRequired,
  fullSizeChart: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

// export default sizeMe()(HydroContent);
export default HydroContent;
