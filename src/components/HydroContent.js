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
    border: '3px solid green',
    bottom: 0,
    position: 'absolute',
    // gridArea: 'chartContent',
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
    color: '#e58030',
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

function HydroContent({ size, windowSize }) {
  const [fullSizeChart, setFullSizeChart] = React.useState(false);
  const [chartHeight, setChartHeight] = React.useState();
  const [chartWidth, setChartWidth] = React.useState();

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
      console.log('initial chart height', height);
    },
  });

  console.log('chart height', chartHeight);
  const classes = useStyles();
  // const scale = useSelector(state => state.scale);
  const tabIndex = useSelector(state => state.tabIndex);
  const location = useSelector(state => state.stationID);
  const paramKey =
    stations[location].params[tabIndex] || stations[location].params[0];
  const stationName = stations[location].title;
  const selectedParameter = stationMetrics[paramKey].param_nm;

  const stationData = useSelector(state => state.stationData);

  const { width: localWidth } = size || {};
  const scale = localWidth / 1252;

  const scaleHeight = 800 * scale;
  const scaleWidth = 1250 * scale;

  const { config, isOffline, hasData } = getChartData({
    fullSizeChart,
    height: chartHeight,
    location,
    scale,
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

  // These are an unfortunate result of using an image for content- there are ways around it,
  // // but this is the simplest option.
  // const chartOffset = scale * 600;
  // const toolbarOffset = 48;
  // const topOffset = chartOffset + toolbarOffset;

  let imgSrc = backgroundImages[`${paramKey.toLowerCase()}Image`];
  if (!imgSrc || fullSizeChart) {
    imgSrc = backgroundPanel;
  }
  console.log('width', width, config);

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
        <h3 className={classes.liveDataTitle}>
          {`Live ${stationName} ${selectedParameter} Data`}
        </h3>
        {offlineWarning}
        <HighchartsReact highcharts={Highcharts} options={config} immutable />
      </div>
    </div>
  );
}

// export default sizeMe()(HydroContent);
export default HydroContent;
