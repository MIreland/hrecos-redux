import { stubbedData } from 'utils/stubbedData';
import { ACTIONS } from './action';

const COUNTDOWN_MAX = 30;

const defaultState = {
  countdown: COUNTDOWN_MAX,
  stationData: JSON.parse(stubbedData),
  scale: 1,
  stationID: 'pier84',
  tabIndex: 0,
  timerEnabled: true,
  weatherData: {},
};

const todoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_STATION: {
      return { ...state, stationID: action.payload };
    }

    case ACTIONS.SET_SCALE: {
      return { ...state, scale: action.payload };
    }

    case ACTIONS.LOADED_STATION: {
      return { ...state, stationData: JSON.parse(stubbedData) };
    }

    case ACTIONS.COUNTDOWN: {
      const countdown = state.countdown > 1 ? state.countdown - 1 : COUNTDOWN_MAX;
      let { tabIndex } = state;
      if (state.countdown === 1) {
        tabIndex += 1;
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
