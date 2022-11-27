/* eslint-disable max-len */
import React, { PropTypes } from 'react';
import { makeStyles } from '@material-ui/core';
import maristMap from 'assets/Marist_map.png';
import norrieMap from 'assets/Norrie_map.png';
import pier84Map from 'assets/Pier84_map.png';
import piermontPierMap from 'assets/Piermont_map.png';
import albanyMap from 'assets/Albany_map.png';
import RiverMap from 'assets/HRECOS_Map2_Medium.png';
import { useSelector } from 'react-redux';
import theme from './AboutHRECOS.module.scss';

const mapMap = {
  albany: albanyMap,
  marist: maristMap,
  norriePoint: norrieMap,
  pier84: pier84Map,
  piermont: piermontPierMap,
};

const useStyles = makeStyles({
  centeredText: {
    fontFamily: 'calibri',
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageWrapper: {
    float: 'right',
    gridColumn: 3,
    padding: '1em',
    position: 'relative',
    width: '30%',
  },
  root: {
    color: 'white',
    fontFamily: 'calibre',
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
          src={mapMap[stationID] || RiverMap}
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
