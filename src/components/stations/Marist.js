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

export function Beczak({ weatherTicker, time, scale }) {

  const t = new Date();
  const timehash = `${t.getDate()}${t.getHours()}${round(t.getMinutes() / 15)}`;
  const maristImageLink = `http://www.hrecos.org/transfer/PumpSta.JPG#${timehash}`;

  return (
    <div className={theme.beczak}>
      <div className={theme.imageWrapper} >
        <p>{stationText.marist[0]}</p>
        <img alt="Marist Live Video Feed" className={theme.maristImage} src={maristImageLink} />
        <p><strong>{stationText.marist[1]}</strong></p>
        <p>{stationText.marist[2]}</p>
      </div>
    </div>
  );
}


Beczak.propTypes = {
  scale: PropTypes.number.isRequired,
  time: PropTypes.string,
  weatherTicker: PropTypes.object.isRequired,
};

export default Beczak;
