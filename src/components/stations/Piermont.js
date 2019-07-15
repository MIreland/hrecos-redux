import React from 'react';
import PropTypes from 'prop-types';
import piermontAboutMap from 'assets/about_piermont.png';
import stationText from 'utils/aboutStationData';
import theme from 'components/AboutStationCard.module.scss';

export function Piermont({ weatherTicker, time, scale }) {

  return (
    <div className={theme.content}>
      <div className={theme.piermont}>
        <div className={theme.piermontImageWrapper}>
          <img alt="Piermont Map" src={piermontAboutMap} />
        </div>
        <div>
          <p>{stationText.piermont[0]}</p>
          <p>{stationText.piermont[1]}</p>
          <p>{stationText.piermont[2]}</p>
        </div>
      </div>
        <div className={theme.marqueeContainer}>
          <p className={theme.weatherTime}>
            <strong className={theme.underline}>
              {'Piermont Weather'}
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


Piermont.propTypes = {
  scale: PropTypes.number.isRequired,
  time: PropTypes.string,
  weatherTicker: PropTypes.object.isRequired,
};

export default Piermont;
