import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setTabIndex } from 'modules/action';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import stations from '../utils/stations.json';
import stationMetrics from '../utils/metrics';
import HydroContent from './HydroContent';
import { useWindowSize } from '../utils/useWindowSize';

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const useStyles = makeStyles(theme => ({
  appBar: {
    background: '#007465',
    display: 'grid',
    flexDirection: 'row',
    fontFamily: 'Arial,sans-serif !important',
    gridTemplateAreas: '"maximize tabs countdown"',
    gridTemplateColumns: 'auto 1fr auto',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 12,
  },
  countdown: {
    display: 'flex',
    lineHeight: '3rem',
    placeItems: 'center',
  },
  formToggle: {
    display: 'grid',
    gridArea: 'maximize',
    gridTemplateColumns: 'auto auto',
    zIndex: 110,
  },
  inputLabel: {
    placeSelf: 'center',
  },
  inputSwitch: {
    placeSelf: 'center',
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'grid',
    flexGrow: 1,
    gridArea: 'metric',
    gridTemplateRows: 'auto 1fr',
    // gridColumnStart: 2,
    // gridRowEnd: 'span 2',
    // gridRowStart: 1,
  },
  spacer: {
    display: 'flex',
  },
  tab: {
    minWidth: 140,
  },
  tabs: {
    display: 'flex',
    gridArea: 'tabs',
  },
}));

export default function SimpleTabs({ failedToLoadData, isLoading, embedded }) {
  const classes = useStyles();
  const tabIndex = useSelector(state => state.tabIndex);
  const location = useSelector(state => state.stationID);
  const timerEnabled = useSelector(state => state.timerEnabled);
  const countdown = useSelector(state => state.countdown);
  const windowSize = useWindowSize();
  const [fullSizeChart, setFullSizeChart] = React.useState(false);

  const orientation = windowSize.width < 1200 ? 'vertical' : 'horizontal';

  const dispatch = useDispatch();
  const { params } = stations[location];

  if (embedded) {
    return (
      <div className={`${classes.root} tab-card`}>
        <HydroContent
          failedToLoadData={failedToLoadData}
          isLoading={isLoading}
          fullSizeChart={fullSizeChart}
        />
      </div>
    );
  }

  const tabs = params.map((key) => {
    let label = stationMetrics[key].param_nm;
    if (label.toLocaleLowerCase().includes('temp') && windowSize.width < 1500) {
      label = 'Water Temp';
    }
    if (
      label.toLocaleLowerCase() === 'conductivity'
      && windowSize.width > 1600
    ) {
      label = 'Specific Conductivity';
    }
    return <Tab className={classes.tab} key={key} label={label} />;
  });

  function handleChange(event, newValue) {
    dispatch(setTabIndex(newValue));
  }

  const countdownWrapper = timerEnabled && (
    <span className={classes.countdown}>{`Next in ${countdown} seconds`}</span>
  );

  return (
    <div className={`${classes.root} tab-card`}>
      <AppBar className={classes.appBar} position="static">
        <Tabs
          className={classes.tabs}
          value={tabIndex}
          onChange={handleChange}
          orientation={orientation}
        >
          {tabs}
        </Tabs>
        <FormControl className={classes.formToggle}>
          <label htmlFor="chartsize" className={classes.inputLabel}>
            Maximize Chart
          </label>
          <Switch
            id="chartsize"
            className={classes.inputSwitch}
            value={fullSizeChart}
            checked={fullSizeChart}
            onChange={() => setFullSizeChart(!fullSizeChart)}
          />
        </FormControl>
        {countdownWrapper}
      </AppBar>
      <HydroContent
        failedToLoadData={failedToLoadData}
        isLoading={isLoading}
        fullSizeChart={fullSizeChart}
      />
    </div>
  );
}

SimpleTabs.propTypes = {
  embedded: PropTypes.bool,
  failedToLoadData: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
