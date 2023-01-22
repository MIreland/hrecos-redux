import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Marquee from 'react-fast-marquee';
import theme from 'components/AboutStationCard.module.scss';
import norrieCanoe from '../../assets/norrieCanoe.jpg';
import stationText from '../../utils/aboutStationData';

export function Norrie({ weatherTicker, time }) {
  return (
    <div className={theme.norrie}>
      <div>
        <p>{stationText.norrie[0]}</p>
        <div className={theme.norrieImageWrapper}>
          <img alt="Norrie Point" src={norrieCanoe} />
        </div>
        <p className={theme.norrieImageText}>{stationText.norrie[1]}</p>
      </div>
      <div className={theme.marqueeContainer}>
        <p className={theme.weatherTime}>
          <strong className={theme.underline}>Norrie Weather</strong>
          {` as of ${time}:`}
        </p>
        <Marquee
          gradient={false}
          style={{
            width: 400,
          }}
          speed={50}
        >
          {weatherTicker}
        </Marquee>
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
