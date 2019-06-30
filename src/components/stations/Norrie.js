import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { round } from 'lodash';
import { useSelector } from 'react-redux';
import maristMap from 'assets/Marist_map.png';
import norrieMap from 'assets/Norrie_map.png';
import pier84Map from 'assets/Pier84_map.png';
import beczakMap from 'assets/beczakMap.jpg';
import piermontPierMap from 'assets/Piermont_map.png';
import piermontAboutMap from 'assets/about_piermont.png';
import aboutPier84 from 'assets/about_pier84.jpg';
import aboutPortOfAlbany from 'assets/about_albany.png';
import norrieCanoe from 'assets/norrieCanoe.jpg';
import stationText from 'utils/aboutStationData';
import stations from 'utils/stations.json';
import { formattedWeather, createWeather } from 'utils/parseWeather';
import { makeStyles } from '@material-ui/core';
import theme from 'components/AboutStationCard.module.scss';

export function Norrie({ weatherTicker, time, scale }) {
  return (
    <div className={theme.norrie}>
      <div>
        <p>{stationText.norrie[0]}</p>
        <div className={theme.norrieImageWrapper}>
          <img alt="Norrie Point" src={norrieCanoe} />
        </div>
        <p className={theme.norrieImageText}>
          {stationText.norrie[1]}
        </p>
      </div>
      <div className={theme.marqueeContainer}>
        <p className={theme.weatherTime}>
          <strong className={theme.underline}>
            {'Norrie Weather'}
          </strong>
          {` as of ${time}:`}
        </p>
        <p
          className={theme.weatherTicker}
        >
          {weatherTicker}
        </p>
      </div>

    </div>
  );
}


Norrie.propTypes = {
  scale: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
  weatherTicker: PropTypes.object.isRequired,
};

export default Norrie;
