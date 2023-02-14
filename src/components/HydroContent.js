import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { useSelector } from 'react-redux';
import sizeMe from 'react-sizeme';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useDimensions from 'react-cool-dimensions';
import PropTypes from 'prop-types';
import stationMetrics from '../utils/metrics';
import salt from '../assets/HRECOS_PANEL_SALT.png';
import chlorophyll from '../assets/HRECOS_PANEL_CHL.jpg';
import phycocyan from '../assets/HRECOS_PANEL_FCP.jpg';
import dissolvedOxygen from '../assets/HRECOS_PANEL_DO.png';
// import backgroundSource from '../assets/HRECOS_background_small.png';
import getChartData from '../utils/chartData';
import piermontDO from '../assets/HRECOS_PANEL_DO_PIERMONT.png';
import conductivity from '../assets/HRECOS_PANEL_COND.png';
import waterTemp from '../assets/HRECOS_PANEL_WATER_TEMP.png';
import turb from '../assets/HRECOS_PANEL_TURB.png';
import waterDepth from '../assets/HRECOS_PANEL_WATER_LEVEL.png';
import acidity from '../assets/HRECOS_PANEL_PH.png';
import backgroundPanel from '../assets/HRECOS_background.png';
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
    bottom: 0,
    position: 'absolute',
  },
  formToggle: {
    position: 'absolute',
    right: 20,
    zIndex: 110,
  },
  fullSizeChart: {
    height: '100%',
  },
  liveDataTitle: {
    fontFamily: 'Montserrate Black, sans-serif',
    fontSize: '24px',
    fontWeight: 800,
    marginBottom: -10,
    marginLeft: '15%',
    marginTop: 4,
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
    minWidth: 200,
    zIndex: 100,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',

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

function HydroContent({ failedToLoadData, isLoading }) {
  const [fullSizeChart, setFullSizeChart] = React.useState(false);
  const [chartHeight, setChartHeight] = React.useState(0);
  const [chartWidth, setChartWidth] = React.useState(0);

  const backgroundSize = '100% 100%';
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

  return (
    <div
      className={`${classes.root} hydro-wrapper ${
        fullSizeChart && classes.fullHeightChart
      }`}
      ref={observe}
      key={imgSrc}
      style={{ backgroundImage: `url(${imgSrc})`, backgroundSize }}
    >
      <FormControl className={classes.formToggle}>
        <InputLabel htmlFor="chartsize">Maximize Chart</InputLabel>
        <Switch
          value={fullSizeChart}
          checked={fullSizeChart}
          onChange={() => setFullSizeChart(!fullSizeChart)}
        />
      </FormControl>
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
        {!failedToLoad && <HighchartsReact highcharts={Highcharts} options={config} immutable />}
      </div>
    </div>
  );
}

HydroContent.propTypes = {
  failedToLoadData: PropTypes.bool.isRequired,
};

// export default sizeMe()(HydroContent);
export default HydroContent;
