import React from 'react';
import PropTypes from 'prop-types';
import aboutPier84 from 'assets/about_pier84.jpg';
import stationText from 'utils/aboutStationData';
import theme from 'components/AboutStationCard.module.scss';

export function Piermont({ weatherTicker, time, scale }) {
  return (
    <div className={theme.content}>
      <div className={theme.piermont}>
        <div className={theme.piermontImageWrapper}>
          <img
            className={theme.piermontImage}
            alt="Piermont Image"
            src={aboutPier84}
          />
        </div>
        <div>
          <p>{stationText.pier84[0]}</p>
          <p>{stationText.pier84[1]}</p>
        </div>
      </div>
      <div className={theme.marqueeContainer}>
        <p className={theme.weatherTime}>
          <strong className={theme.underline}>{'Pier 84 Weather'}</strong>
          {` as of ${time}:`}
        </p>
        <p className={theme.weatherTicker}>{weatherTicker}</p>
      </div>
    </div>
  );
}

Piermont.propTypes = {
  scale: PropTypes.number.isRequired,
  time: PropTypes.string,
  weatherTicker: PropTypes.object.isRequired,
};

export default Piermont;
