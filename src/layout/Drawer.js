import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import ToolboxDrawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import stations from 'utils/stations.json';
import { ACTIONS } from 'modules/action';
import { makeStyles } from '@material-ui/core';
import theme from './Drawer.module.scss';

const disclaimerText = 'Production of this website was supported by the U.S. EPA, the Hudson River Foundation, and '
  + 'the NY-NJ Harbor & Estuary Program.  It may not necessarily reflect the views of these organizations, '
  + 'and no official endorsement should be inferred.';

const sizeDisclaimer = 'This page is optimized for viewing at 1920x1080 resolution in '
  + 'Chrome Web Browser\'s full-screen mode';


const useStyles = makeStyles({
  fullList: {
    width: 'auto',
  },
  list: {
    width: 280,
  },
});

function Drawer({ open, setOpen }) {
  const classes = useStyles();
  const stationID = useSelector(state => state.stationID);
  const timerEnabled = useSelector(state => state.timerEnabled);
  const dispatch = useDispatch();

  useEffect(() => {
    let timerID;
    if (timerEnabled) {
      timerID = setInterval(() => {
        dispatch({ type: ACTIONS.COUNTDOWN });
      }, 1000);
    }
    return () => clearInterval(timerID);
  }, [dispatch, timerEnabled]);

  const toggleTimer = () => {
    if (timerEnabled) {
      navigate(`#/station/${stationID}`);
      dispatch({ type: ACTIONS.DISABLE_TIMER });
    } else {
      navigate(`#/station/${stationID}/auto`);
      dispatch({ type: ACTIONS.ENABLE_TIMER });
    }
  };

  const navigateAndResetIndex = (newStationID) => {
    dispatch({ payload: 0, type: ACTIONS.SET_TAB_INDEX });
    navigate(`#/station/${newStationID}`);
  };

  const ListItems = Object.values(stations).map(station => (
    <ListItem
      key={station.id}
      button
      selected={stationID === station.id}
      onClick={() => navigateAndResetIndex(station.id)}
    >
      <ListItemText primary={station.title} />
    </ListItem>
  ));
  return (
    <ToolboxDrawer open={open} onClose={() => setOpen(!open)}>
      <div className={classes.list}>
        <List subheader={<ListSubheader>Settings</ListSubheader>}>
          {ListItems}
        </List>
        <List subheader={
          <ListSubheader>Configuration</ListSubheader>
        }
        >
          <ListItem role={undefined} dense button onClick={toggleTimer}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={timerEnabled}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': 'timerEnabled' }}
              />
            </ListItemIcon>
            <ListItemText id="timerEnabled" primary="Cycle Automatically" />
          </ListItem>


          <Divider />
        </List>
        <div className={theme.sizeMessage}>
          <p className={theme.sizeDisclaimer}>{sizeDisclaimer}</p>
          <Divider />
        </div>
        <p className={theme.disclaimer}>{disclaimerText}</p>
      </div>
    </ToolboxDrawer>
  );
}

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Drawer;
