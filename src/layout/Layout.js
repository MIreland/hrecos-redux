import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import Card from 'components/Card';
import TabCard from 'components/TabCard';
import AboutHRECOS from 'components/AboutHRECOS';
import AboutStation from 'components/AboutStationCard';
import { useDispatch, useSelector } from 'react-redux';
import { ACTIONS, updateStation } from 'modules/action';
import Header from './Header';
import style from './Layout.module.scss';

const isLocal = window.location.href.includes('localhost');
const INTERVAL = 60 * 1000 * 15;

function Layout({ stationID, autoCycle, embedded, sample }) {
  console.log('stationID', stationID, embedded, sample);
  const dispatch = useDispatch();
  const timerEnabled = useSelector(state => state.timerEnabled);
  const [refresh, toggleRefresh] = useState(false);

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
    const timer = setInterval(() => toggleRefresh(!refresh), INTERVAL);
    return () => clearInterval(timer);
  });

  useEffect(() => {
    dispatch({
      type: autoCycle ? ACTIONS.ENABLE_TIMER : ACTIONS.DISABLE_TIMER,
    });
  }, [autoCycle, dispatch]);

  useEffect(() => {
    dispatch(updateStation(stationID));
    dispatch({ type: ACTIONS.LOADING_STATION });
    fetch(`${isLocal ? 'http://localhost:3002' : ''}/api/station/${stationID}`)
      .then(data => data.json())
      .then(data => dispatch({ payload: data, type: ACTIONS.LOADED_STATION }));
  }, [dispatch, stationID, refresh]);

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
        <div className={style.leftSide}>
          <Card title="What is HRECOS?">
            <AboutHRECOS />
          </Card>
          <Card title="About Station">
            <AboutStation />
          </Card>
        </div>
        <TabCard />
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
