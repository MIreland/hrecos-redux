import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { round } from 'lodash';
import stationText from 'utils/aboutStationData';
import theme from 'components/AboutStationCard.module.scss';

export function Beczak() {
  const t = new Date();
  const timehash = `${t.getDate()}${t.getHours()}${round(t.getMinutes() / 15)}`;
  const maristImageLink = `http://www.hrecos.org/transfer/PumpSta.JPG#${timehash}`;

  return (
    <div className={theme.marist}>
      <div className={theme.imageWrapper}>
        <p>{stationText.marist[0]}</p>
        <img alt="Marist Live Video Feed" className={theme.maristImage} src={maristImageLink} />
        <p><strong>{stationText.marist[1]}</strong></p>
        <p>{stationText.marist[2]}</p>
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
