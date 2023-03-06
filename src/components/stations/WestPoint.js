import React from 'react';
import PropTypes from 'prop-types';
import theme from '../AboutStationCard.module.scss';
import stationText from '../../utils/aboutStationData';
import westPointImg from '../../assets/west-point-image.JPG';

export function WestPoint() {
  return (
    <div className={theme.content}>
      <div className={theme.piermont}>
        <div className={theme.albanyImageWrapper}>
          <img alt="West Point" src={westPointImg} />
        </div>
        <div>
          <p>{stationText.westPoint[0]}</p>
          <p>{stationText.westPoint[1]}</p>
          <p>{stationText.westPoint[2]}</p>
        </div>
      </div>
    </div>
  );
}

WestPoint.propTypes = {};

export default WestPoint;
