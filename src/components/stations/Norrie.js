import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import norrieCanoe from 'assets/norrieCanoe.jpg';
import stationText from 'utils/aboutStationData';
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
  time: PropTypes.string,
  weatherTicker: PropTypes.object.isRequired,
};

export default Norrie;
