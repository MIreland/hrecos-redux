// types of action
export const ACTIONS = {
  DISABLE_TIMER: 'DISABLE_TIMER',
  ENABLE_TIMER: 'ENABLE_TIMER',
  COUNTDOWN: 'COUNTDOWN',
  LOADED_STATION: 'LOADED_STATION',
  LOADING_STATION: 'LOADING_STATION',
  SET_TAB_INDEX: 'SET_TAB_INDEX',
  SET_SCALE: 'SET_SCALE',
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
  updateStation,
  setScale,
};
