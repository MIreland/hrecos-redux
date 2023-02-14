import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { round } from 'lodash';
import theme from 'components/AboutStationCard.module.scss';
import stationText from '../../utils/aboutStationData';

export function Marist() {
  const t = new Date();
  const timehash = `${t.getDate()}${t.getHours()}${round(t.getMinutes() / 15)}`;
  const maristImageLink = `http://www.hrecos.org/transfer/PumpSta.JPG#${timehash}`;

  return (
    <div className={theme.marist}>
      <div className={theme.imageWrapper}>
        <p>{stationText.marist[0]}</p>
        <img
          alt="Marist Live Video Feed"
          className={theme.maristImage}
          src={maristImageLink}
        />
        <p>
          <strong>{stationText.marist[1]}</strong>
        </p>
        <p>{stationText.marist[2]}</p>
      </div>
    </div>
  );
}

export default Marist;
