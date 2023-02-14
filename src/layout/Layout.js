import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import Card from '../components/Card';
import TabCard from '../components/TabCard';
import AboutHRECOS from '../components/AboutHRECOS';
import AboutStation from '../components/AboutStationCard';
import { ACTIONS, updateStation } from '../modules/action';
import Header from './Header';
import style from './Layout.module.scss';

const isLocal = window.location.href.includes('localhost');
const INTERVAL = 60 * 1000 * 15;

const fetchStationData = async ({ queryKey }) => {
  const stationID = queryKey[0];
  const resp = await fetch(`${isLocal ? 'http://localhost:3002' : ''}/api/station/${stationID}`);
  const data = await resp.json();
  return data;
};

function Layout({ stationID, autoCycle, embedded }) {
  console.log('stationID', stationID, embedded);
  const dispatch = useDispatch();
  const timerEnabled = useSelector(state => state.timerEnabled);

  useEffect(() => {
    let timerID;
    if (timerEnabled) {
      timerID = setInterval(() => {
        dispatch({ type: ACTIONS.COUNTDOWN });
      }, 1000);
    }
    return () => clearInterval(timerID);
  }, [dispatch, timerEnabled]);


  useEffect(() => {
    dispatch({
      type: autoCycle ? ACTIONS.ENABLE_TIMER : ACTIONS.DISABLE_TIMER,
    });
  }, [autoCycle, dispatch]);

  const { data: stationResponse, isError: failedToLoadData, isLoading } = useQuery({
    onSuccess: (data) => {
      dispatch({ payload: data, type: ACTIONS.LOADED_STATION });
    },
    refetchInterval: INTERVAL,
    queryFn: fetchStationData,
    queryKey: [stationID] });

  console.log('stationResponse', stationResponse, failedToLoadData, isLoading);

  useEffect(() => {
    dispatch(updateStation(stationID));
  }, [dispatch, stationID]);

  if (embedded) {
    return (
      <div className={style.embedded}>
        <TabCard embedded />
      </div>
    );
  }

  return (
    <Fragment>
      <Header />
      <div className={style['grid-layout']}>
        <Card title="What is HRECOS?" className={style.aboutHrecos}>
          <AboutHRECOS />
        </Card>
        <Card
          title="About Station"
          className={`about-station ${style.aboutStation}`}
        >
          <AboutStation failedToLoadData={failedToLoadData} isLoading={isLoading} />
        </Card>
        <TabCard failedToLoadData={failedToLoadData} isLoading={isLoading}/>
      </div>
    </Fragment>
  );
}

Layout.propTypes = {
  autoCycle: PropTypes.bool,
  embedded: PropTypes.bool,
  stationID: PropTypes.string,
};

Layout.defaultProps = {
  autoCycle: false,
  embedded: false,
  stationID: 'norriePoint',
};

export default Layout;
