import { stubbedData } from 'utils/stubbedData';
import { ACTIONS } from './action';
import stations from '../utils/stations';

const COUNTDOWN_MAX = 30;

const defaultState = {
  countdown: COUNTDOWN_MAX,
  scale: 1,
  stationData: {},
  stationID: 'pier84',
  tabIndex: 0,
  timerEnabled: true,
  weatherData: {},
};

const todoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_STATION: {
      return {
        ...state, stationID: action.payload, stationData: {}, tabIndex: 0,
      };
    }

    case ACTIONS.SET_SCALE: {
      return { ...state, scale: action.payload };
    }

    // TODO: verify this is unneeded
    // case ACTIONS.LOADING_STATION: {
    //   return { ...state, stationData: {} };
    // }

    case ACTIONS.LOADED_STATION: {
      const stationData = action.payload;
      if (['marist', 'piermont', 'norriePoint', 'pier84'].includes(state.stationID)) {
        stationData.DEPTH = stationData.ELEV;
      }
      return { ...state, stationData };
    }

    case ACTIONS.COUNTDOWN: {
      const countdown = state.countdown > 1 ? state.countdown - 1 : COUNTDOWN_MAX;
      let { tabIndex } = state;
      if (state.countdown === 1) {
        tabIndex += 1;
        const { stationID } = state;
        if (stations[stationID].params.length - 1 < tabIndex) {
          tabIndex = 0;
        }
      }
      return { ...state, countdown, tabIndex };
    }

    case ACTIONS.SET_TAB_INDEX: {
      return { ...state, tabIndex: action.payload };
    }

    case ACTIONS.DISABLE_TIMER: {
      return { ...state, timerEnabled: false };
    }

    case ACTIONS.ENABLE_TIMER: {
      return { ...state, timerEnabled: true };
    }

    default:
      return state;
  }
};

export default todoReducer;
