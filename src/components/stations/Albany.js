import React from 'react';
import PropTypes from 'prop-types';
import theme from '../AboutStationCard.module.scss';
import aboutPortOfAlbany from '../../assets/about_albany.png';
import stationText from '../../utils/aboutStationData';

export function Beczak({ weatherTicker, time, isLoading }) {
  return (
    <div className={theme.content}>
      <div className={theme.albany}>
        <div className={theme.albanyImageWrapper}>
          <img alt="Port Of Albany" src={aboutPortOfAlbany} />
        </div>
        <p>{stationText.albany[0]}</p>
      </div>
      {!isLoading && <div className="marqueeRelative marqueeRelativeTest">
        <div className={theme.marqueeContainer}>
          <p className={theme.weatherTime}>
            <strong className={theme.underline}>Albany Weather</strong>
            {` as of ${time}:`}
          </p>
          <p className={theme.weatherTicker}>{weatherTicker}</p>
        </div>
      </div>}
    </div>
  );
}

Beczak.propTypes = {
  scale: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  weatherTicker: PropTypes.object.isRequired,
};

export default Beczak;
