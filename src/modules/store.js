import { createStore, applyMiddleware } from 'redux';

// Logger with default options
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import reducer from './reducer';

export default function configureStore(initialState) {
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...[thunk, createLogger({ collapsed: true })]),
  );
  return store;
}
