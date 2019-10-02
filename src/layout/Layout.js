import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Card from 'components/Card';
import TabCard from 'components/TabCard';
import AboutHRECOS from 'components/AboutHRECOS';
import AboutStation from 'components/AboutStationCard';
import { useDispatch } from 'react-redux';
import { ACTIONS, updateStation } from 'modules/action';
import Header from './Header';
import style from './Layout.module.scss';

const isLocal = window.location.href.includes('localhost');
// const AboutStation = () => <div>AboutStation</div>;
const Chart = () => <div>Chart</div>;

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const INTERVAL = 60 * 1000 * 15;

function Layout({ stationID, autoCycle, embedded, sample }) {
  console.log('stationID layout', stationID, sample)
  const dispatch = useDispatch();
  const [refresh, toggleRefresh] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => toggleRefresh(!refresh), INTERVAL);
    return () => clearInterval(timer);
  });

  useEffect(() => {
    dispatch({ type: autoCycle ? ACTIONS.ENABLE_TIMER : ACTIONS.DISABLE_TIMER });
  }, [autoCycle, dispatch]);
  useEffect(() => {
    dispatch(updateStation(stationID));
    dispatch({ type: ACTIONS.LOADING_STATION });
    fetch(`${isLocal ? 'http://localhost:3002' : ''}/api/station/${stationID}`)
      .then(data => data.json())
      .then(data => (
        console.log('fetch!', data) || dispatch({ payload: data, type: ACTIONS.LOADED_STATION })
      ));
  }, [dispatch, stationID, refresh]);

  if (embedded) {
    return <Chart />;
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
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
