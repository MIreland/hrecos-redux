import React from 'react';
import PropTypes from 'prop-types';
import theme from '../AboutStationCard.module.scss';
import aboutPier84 from '../../assets/about_pier84.jpg';
import stationText from '../../utils/aboutStationData';

export function Piermont({ weatherTicker, time }) {
  return (
    <div className={theme.content}>
      <div className={theme.piermont}>
        <div className={theme.piermontImageWrapper}>
          <img
            className={theme.piermontImage}
            alt="Piermont"
            src={aboutPier84}
          />
        </div>
        <div>
          <p>{stationText.pier84[0]}</p>
          <p>{stationText.pier84[1]}</p>
        </div>
      </div>
      {time && (
        <div className={theme.marqueeContainer}>
          <p className={theme.weatherTime}>
            <strong className={theme.underline}>Pier 84 Weather</strong>
            {` as of ${time}:`}
          </p>
          <p className={theme.weatherTicker}>{weatherTicker}</p>
        </div>
      )}
    </div>
  );
}

Piermont.propTypes = {
  time: PropTypes.string,
  weatherTicker: PropTypes.object.isRequired,
};

export default Piermont;
