/* eslint-disable max-len */
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import maristMap from '../assets/maps/HRECOS_Stations_Marist.jpg';
import norrieMap from '../assets/maps/HRECOS_Stations_Norrie.jpg';
import beczakMap from '../assets/maps/HRECOS_Stations_Beczak.jpg';
import westPointMap from '../assets/maps/HRECOS_Stations_West_Point.jpg';
import pier84Map from '../assets/maps/HRECOS_Stations_Pier_84.jpg';
import piermontPierMap from '../assets/maps/HRECOS_Stations_Piermont.jpg';
import albanyMap from '../assets/maps/HRECOS_Stations_Port_of_Albany.jpg';
import theme from './AboutHRECOS.module.scss';

const mapMap = {
  albany: albanyMap,
  beczak: beczakMap,
  marist: maristMap,
  norriePoint: norrieMap,
  pier84: pier84Map,
  piermont: piermontPierMap,
  westPoint: westPointMap,
};

const useStyles = makeStyles({
  centeredText: {
    fontFamily: 'Arial',
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageWrapper: {
    float: 'right',
    gridColumn: 3,
    position: 'relative',
    width: '30%',
  },
  root: {
    color: 'white',
    fontFamily: 'Arial',
    position: 'relative',
  },
});

function AboutHRECOS() {
  const classes = useStyles();
  const stationID = useSelector(state => state.stationID);
  const location = stationID;
  return (
    <div className={classes.root}>
      <div className={classes.imageWrapper}>
        <img
          alt={location}
          className={theme.mapImage}
          src={mapMap[stationID] || norrieMap}
        />
      </div>
      <p>
        The Hudson River Environmental Conditions Observing System (HRECOS) is
        an alliance of partners that run
        <strong>&nbsp;continuous monitoring stations&nbsp;</strong>
        on the Hudson River and surrounding water bodies, recording their
        “pulse”.
      </p>
      <p>
        Every 15 minutes, sensors take water quality and weather readings and
        wirelessly transmit data to our website in near real-time.
      </p>
      <p>
        HRECOS data is freely available to the public and is used for research,
        education, navigation, and environmental management, and by many others.
      </p>
      <p className={classes.centeredText}>
        Visit&nbsp;
        <a
          style={{ color: 'white', fontWeight: 'bold' }}
          target="_blank"
          rel="noreferrer noopener"
          href="http://www.hrecos.org"
        >
          www.hrecos.org
        </a>
        &nbsp;for more info and live or historical data
      </p>
    </div>
  );
}

export default AboutHRECOS;
