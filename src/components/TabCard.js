import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import stations from 'utils/stations.json';
import stationMetrics from 'utils/metrics';
import { setTabIndex } from 'modules/action';
import HydroContent from './HydroContent';

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
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    gridColumnStart: 2,
    gridRowEnd: 'span 2',
    gridRowStart: 1,
    marginRight: '1em',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'Montserrat,sans-serif !important',
    background: '#007465',
  },
  tabs: {
    display: 'flex',
  },
  tab: {
    minWidth: 140,
  },
  countdown: {
    display: 'flex',
    width: '17%',
    lineHeight: '3rem',
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const tabIndex = useSelector(state => state.tabIndex);
  const location = useSelector(state => state.stationID);
  const timerEnabled = useSelector(state => state.timerEnabled);
  const countdown = useSelector(state => state.countdown);

  const dispatch = useDispatch();
  const { params } = stations[location];

  const tabs = params.map(key => {
    let label = stationMetrics[key].param_nm;
    if (label.toLocaleLowerCase().includes('temp')) {
      label = 'Water Temp';
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
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Tabs className={classes.tabs} value={tabIndex} onChange={handleChange}>
          {tabs}
        </Tabs>
        {countdownWrapper}
      </AppBar>
      <HydroContent />
    </div>
  );
}
