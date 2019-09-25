import React from 'react';
import PropTypes from 'prop-types';
import aboutPortOfAlbany from 'assets/about_albany.png';
import stationText from 'utils/aboutStationData';
import theme from 'components/AboutStationCard.module.scss';

export function Beczak({ weatherTicker, time, scale }) {
  return (
    <div className={theme.content}>
      <div className={theme.albany}>
        <div className={theme.albanyImageWrapper}>
          <img alt="Port Of Albany" src={aboutPortOfAlbany} />
        </div>
        <p>{stationText.albany[0]}</p>
      </div>
      <div className="marqueeRelative marqueeRelativeTest">
        <div className={theme.marqueeContainer}>
          <p className={theme.weatherTime}>
            <strong className={theme.underline}>
              Albany Weather
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

    </div>
  );
}


Beczak.propTypes = {
  scale: PropTypes.number.isRequired,
  time: PropTypes.string,
  weatherTicker: PropTypes.object.isRequired,
};

export default Beczak;
