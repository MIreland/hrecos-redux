import React from 'react';
import PropTypes from 'prop-types';
import theme from '../AboutStationCard.module.scss';
import stationText from '../../utils/aboutStationData';

export function WestPoint({ weatherTicker, time, scale }) {
  return (
    <div className={theme.content}>
      <div className={theme.piermont}>
        <div>
          <p>{stationText.westPoint[0]}</p>
        </div>
      </div>
    </div>
  );
}

WestPoint.propTypes = {
  scale: PropTypes.number.isRequired,
  time: PropTypes.string,
  weatherTicker: PropTypes.object.isRequired,
};

export default WestPoint;
