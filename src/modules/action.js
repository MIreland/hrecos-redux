// types of action
export const ACTIONS = {
  COUNTDOWN: 'COUNTDOWN',
  DISABLE_TIMER: 'DISABLE_TIMER',
  ENABLE_TIMER: 'ENABLE_TIMER',
  LOADED_STATION: 'LOADED_STATION',
  LOADING_STATION: 'LOADING_STATION',
  SET_SCALE: 'SET_SCALE',
  SET_TAB_INDEX: 'SET_TAB_INDEX',
  UPDATE_STATION: 'UPDATE_STATION',
};
// actions
export const setScale = scale => ({
  payload: scale,
  type: ACTIONS.SET_SCALE,
});

export const setTabIndex = index => ({
  payload: index,
  type: ACTIONS.SET_TAB_INDEX,
});

export const updateStation = station => ({
  payload: station,
  type: ACTIONS.UPDATE_STATION,
});

export default {
  ACTIONS,
  setScale,
  updateStation,
};
