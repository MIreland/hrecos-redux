/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import stations from '../utils/stations.json';
import { formattedWeather, createWeather } from '../utils/parseWeather';
import Stations from './stations';

export function AboutStationCard({ failedToLoadData, isLoading }) {
  const stationID = useSelector(state => state.stationID);
  const scale = useSelector(state => state.scale);
  const stationData = useSelector(state => state.stationData);
  const stationName = stations[stationID].title;
  const weatherObject = formattedWeather(stationData);

  if (failedToLoadData) {
    return null;
  }

  const weatherTicker = createWeather(weatherObject, stationName);

  switch (stationID) {
    case stations.albany.id:
      return (
        <Stations.Albany
          weatherTicker={weatherTicker}
          isLoading={isLoading}

          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.norriePoint.id:
      return (
        <Stations.Norrie
          weatherTicker={weatherTicker}
          isLoading={isLoading}
          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.marist.id:
      return (
        <Stations.Marist
          weatherTicker={weatherTicker}
          isLoading={isLoading}
          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.beczak.id:
      return (
        <Stations.Beczak
          weatherTicker={weatherTicker}
          isLoading={isLoading}
          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.pier84.id:
      return (
        <Stations.Pier84
          weatherTicker={weatherTicker}
          isLoading={isLoading}
          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.westPoint.id:
      return (
        <Stations.WestPoint
          weatherTicker={weatherTicker}
          isLoading={isLoading}
          scale={scale}
          time={weatherObject.time}
        />
      )
    case stations.piermont.id:
    default:
      return (
        <Stations.Piermont
          weatherTicker={weatherTicker}
          isLoading={isLoading}
          scale={scale}
          time={weatherObject.time}
        />
      );
  }
}

AboutStationCard.propTypes = {
  failedToLoadData: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default AboutStationCard;
