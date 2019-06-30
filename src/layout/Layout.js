import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Card from 'components/Card';
import TabCard from 'components/TabCard';
import AboutHRECOS from 'components/AboutHRECOS';
import AboutStation from 'components/AboutStationCard';
import { useDispatch } from 'react-redux';
import { ACTIONS, updateStation } from 'modules/action';
import stations from 'utils/stations.json';
import Header from './Header';
import style from './Layout.module.scss';


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

function Layout({ stationID, autoCycle, embedded }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: autoCycle ? ACTIONS.ENABLE_TIMER : ACTIONS.DISABLE_TIMER });
  }, [autoCycle, dispatch]);
  useEffect(() => {
    dispatch(updateStation(stationID));
    dispatch({ type: ACTIONS.LOADING_STATION });
    fetch(`http://localhost:3002/api/station/${stationID}`)
      .then(data => data.json())
      .then(data => (
        console.log('fetch!', data) || dispatch({ payload: data, type: ACTIONS.LOADED_STATION })
      ));
  }, [dispatch, stationID]);

  if (embedded) {
    return <Chart />;
  }

  return (
    <React.Fragment>
      <Header />
      <div className={style['grid-layout']}>
        <Card title="What is HRECOS?">
          <AboutHRECOS />
        </Card>
        <Card title="About Station">
          <AboutStation />
        </Card>
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
