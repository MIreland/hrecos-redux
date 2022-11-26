import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import beczakMap from 'assets/beczakMap.jpg';
import stationText from 'utils/aboutStationData';
import theme from 'components/AboutStationCard.module.scss';

export function Beczak({ weatherTicker, time, scale }) {
  return (
    <div className={theme.beczak}>
      <div className={theme.beczakImageWrapper}>
        <img
          alt="Beczak Sampling"
          className={theme.piermontImage}
          src={beczakMap}
        />
      </div>
      <div>
        <p>{stationText.beczak[0]}</p>
        <p>{stationText.beczak[1]}</p>
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
