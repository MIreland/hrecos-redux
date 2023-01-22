/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';
import stations from '../utils/stations.json';
import { formattedWeather, createWeather } from '../utils/parseWeather';
import Stations from './stations';

export function AboutStationCard() {
  const stationID = useSelector(state => state.stationID);
  const scale = useSelector(state => state.scale);
  const stationData = useSelector(state => state.stationData);
  const stationName = stations[stationID].title;
  const weatherObject = formattedWeather(stationData);

  const weatherTicker = createWeather(weatherObject, stationName);

  switch (stationID) {
    case stations.albany.id:
      return (
        <Stations.Albany
          weatherTicker={weatherTicker}
          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.norriePoint.id:
      return (
        <Stations.Norrie
          weatherTicker={weatherTicker}
          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.marist.id:
      return (
        <Stations.Marist
          weatherTicker={weatherTicker}
          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.beczak.id:
      return (
        <Stations.Beczak
          weatherTicker={weatherTicker}
          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.pier84.id:
      return (
        <Stations.Pier84
          weatherTicker={weatherTicker}
          scale={scale}
          time={weatherObject.time}
        />
      );
    case stations.piermont.id:
    default:
      return (
        <Stations.Piermont
          weatherTicker={weatherTicker}
          scale={scale}
          time={weatherObject.time}
        />
      );
  }
}

export default AboutStationCard;
