import React from 'react';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import './App.css';
import Layout from './layout/Layout';
import configureStore from './modules/store';

console.log("Last updated July 16, 2022");

const reduxStore = configureStore(window.REDUX_INITIAL_DATA);

const theme = createMuiTheme({
  primary: {
    // light: will be calculated from palette.primary.main,
    main: '#007465',
    // dark: will be calculated from palette.primary.main,
    // contrastText: will be calculated to contrast with palette.primary.main
  },
  status: {
    danger: 'orange',
  },
});


function App() {
  return (
    <Provider store={reduxStore}>
      <ThemeProvider theme={theme}>
        <Router>
          <Layout path="/station/:stationID" />
          <Layout path="/station/:stationID/auto" autoCycle />
          <Layout path="/embedded/:stationID" embedded />
          <Layout path="/embedded/:stationID/auto" embedded autoCycle />
          <Layout path="/" default sample />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
