import React, { useEffect, useRef } from 'react';
import {
  get, forEach, last, isNumber, round,
} from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import maristMap from 'assets/Marist_map.png';
import norrieMap from 'assets/Norrie_map.png';
import pier84Map from 'assets/Pier84_map.png';
import beczakMap from 'assets/beczakMap.jpg';
import piermontPierMap from 'assets/Piermont_map.png';
import piermontAboutMap from 'assets/about_piermont.png';
import aboutPier84 from 'assets/about_pier84.jpg';
import aboutPortOfAlbany from 'assets/about_albany.png';
import norrieCanoe from 'assets/norrieCanoe.jpg';
import stationData from 'utils/aboutStationData';
import stations from 'utils/stations.json';
import { formattedWeather, createWeather } from 'utils/parseWeather';
import { makeStyles } from '@material-ui/core';
import theme from './AboutStationCard.module.scss';

export const mapList = [
  maristMap,
  norrieMap,
  pier84Map,
  piermontPierMap,
];

const useStyles = makeStyles({
  imageWrapper: {
    float: 'right', gridColumn: 3, padding: '1em', position: 'relative',
  },
  root: {
    color: 'white',
    position: 'relative',
  },
  weatherContent: {
    fontSize: '.95em',
    color: 'white',
    paddingBottom: '1.5rem',
    fontFamily: 'calibri !important',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

export function AboutStationCard() {
  const imageRef = useRef({});
  // Use this to pre-fetch images
  useEffect(() => {
    setTimeout(() => {
      mapList.forEach((key, index) => {
        imageRef.current[index] = new Image();
        imageRef.current[index].src = mapList[index];
      });
    }, 2000);
  }, []);
  const stationID = useSelector(state => state.stationID);

  let percent = (1 - scale) * 100 / 2;
  percent = `-${percent.toFixed(2)}%`;
  const transform = `translate(${percent}, ${percent}) scale(${scale > 1 ? 1 : scale})`;
  let weatherStyle = { fontSize: `${scale}em` };
  let marqueeStyle = {};
  const weatherObject = formattedWeather(weather);
  const weatherTicker = createWeather(weatherObject, stationName);
  const weatherContentStyle = {
    ...weatherStyle,
  };
  let weatherContent;
  if (stationID === stations.marist.id) {
    const t = new Date();

    // We only want to update the image every 15 minutes.
    const timehash = `${t.getDate()}${t.getHours()}${round(t.getMinutes() / 15)}`;
    const maristImageLink = `http://www.hrecos.org/transfer/PumpSta.JPG#${timehash}`;
    const doubleScale = 1 - ((1 - scale) / 2);
    weatherStyle = {
      color: 'white', fontSize: `${0.85 * doubleScale}em`, marginBottom: '-1rem', textAlign: 'justify',
    };
    weatherContent = (
      <div className={theme.imageWrapper} style={weatherStyle}>
        <p style={{ marginTop: '1em' }}>{stationData.marist[0]}</p>
        <img className={theme.maristImage} src={maristImageLink} />
        <p style={{ fontFamily: 'calibri', fontSize: '1.25em', margin: 0 }}><strong>{stationData.marist[1]}</strong></p>
        <p style={{ fontFamily: 'calibri', margin: 0 }}>{stationData.marist[2]}</p>
      </div>
    );
  } else if (weatherTicker.__html.length > 5) {
    let aboutStation = '';

    if (stationID === stations.pier84.id) {
      aboutStation = (
        <div style={{ fontSize: scale < 0.9 ? '.85em' : '1em', textAlign: 'justify' }}>
          <div className={theme.piermontImageWrapper} style={{ float: 'left', paddingRight: '10px' }}>
            <img className={theme.piermontImage} alt="Piermont Image" style={{ width: `${200 * scale}px` }} src={aboutPier84} />
          </div>
          <div style={{ gridColumn: '2 / 4' }}>
            <p style={{ fontFamily: 'calibri' }}>{stationData.pier84[0]}</p>
            <p style={{ fontFamily: 'calibri' }}>{stationData.pier84[1]}</p>
          </div>
        </div>
      );
    }

    if (stationID === stations.piermont.id) {
      marqueeStyle = { };
      aboutStation = (
        <div style={{ fontSize: scale < 0.9 ? '.85em' : '1em', textAlign: 'justify' }}>
          <div className={theme.piermontImageWrapper} style={{ float: 'left', paddingRight: '10px' }}>
            <img className={theme.piermontImage} style={{ width: `${200 * scale}px` }} src={piermontAboutMap} />
          </div>
          <div style={{ gridColumn: '2 / 4' }}>
            <p style={{ fontFamily: 'calibri' }}>{stationData.piermont[0]}</p>
            <p style={{ fontFamily: 'calibri' }}>{stationData.piermont[1]}</p>
            <p style={{ margin: 0 }}>{stationData.piermont[2]}</p>
          </div>
        </div>
      );
    }

    if (stationID === stations.norriePoint.id) {
      marqueeStyle = { };
      console.log('stationData', stationData, stationData.norrie);
      aboutStation = (
        <div style={{ marginBottom: '-1rem', textAlign: 'justify' }}>
          <p style={{ fontSize: '.9em' }}>{stationData.norrie[0]}</p>
          <div className={theme.norrieImageWrapper} style={{ height: `${180 * scale}px` }}>
            <img className={theme.piermontImage} alt="Norrie Point Image" src={norrieCanoe} />
          </div>
          <p style={{
            fontFamily: 'calibri', fontSize: '.6em', fontStyle: 'italic', marginBottom: '10px', textAlign: 'center',
          }}
          >
            {stationData.norrie[1]}
          </p>
        </div>
      );
    }
    if (stationID === stations.beczak.id) {
      delete weatherContentStyle.flexDirection;
      return (
        <div className={theme.content} style={weatherContentStyle}>
          <div className={theme.piermontImageWrapper} style={{ float: 'left', paddingRight: '10px' }}>
            <img className={theme.piermontImage} style={{ width: `${200 * scale}px` }} src={beczakMap} />
          </div>
          <div style={{ gridColumn: '2 / 4', textAlign: 'justify' }}>
            <p style={{ fontFamily: 'calibri' }}>{stationData.beczak[0]}</p>
            <p style={{ fontFamily: 'calibri' }}>{stationData.beczak[1]}</p>
          </div>
        </div>
      );
    }

    if (stationID === stations.albany.id) {
      marqueeStyle = { };
      aboutStation = (
        <div style={{ display: 'flex', marginBottom: `${7 * scale}rem`, textAlign: 'justify' }}>
          <div className={theme.norrieImageWrapper} style={{ float: 'left', height: `${250 * scale}px`, marginRight: 10 }}>
            <img className={theme.piermontImage} alt="Port Of Albany" src={aboutPortOfAlbany} />
          </div>
          <p style={{ float: 'left', fontSize: '1em' }}>{stationData.albany[0]}</p>
        </div>
      );
    }
    weatherContent = (
      <div className={theme.content} style={weatherContentStyle}>
        <div style={{ display: 'flex', marginBottom: `${7 * scale}rem`, textAlign: 'justify' }}>
          <div className={theme.norrieImageWrapper} style={{ float: 'left', height: `${250 * scale}px`, marginRight: 10 }}>
            <img className={theme.piermontImage} alt="Port Of Albany" src={aboutPortOfAlbany} />
          </div>
          <p style={{ float: 'left', fontSize: '1em' }}>{stationData.albany[0]}</p>
        </div>
        <div className="marqueeRelative marqueeRelativeTest" style={{ height: '3rem', position: 'relative', width: '100%' }}>
          <div className={theme.marqueeContainer} style={marqueeStyle}>
            <p className={theme.weatherTime} style={marqueeStyle}>
              <strong style={{ textDecoration: 'underline' }}>
                {stationName}
                {' '}
Weather
              </strong>
              {` as of ${weatherObject.time}:`}
            </p>
            <p
              className={theme.weatherTicker}
            >
              {createWeather(weatherObject, stationName)}
            </p>
          </div>
        </div>

      </div>
    );
  } else {
    weatherContent = <p className={theme.content} style={weatherStyle}>Weather Content is Unavailable</p>;
  }
  return weatherContent;
}


AboutStationCard.propTypes = {
  stationName: PropTypes.string,
  weather: PropTypes.object,
};

export default AboutStationCard;
