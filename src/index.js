import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import state from './reducers';
import {Provider} from 'react-redux';

const store = createStore(state);
const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: 'white',
        top: '50%',
        borderRadius: 100,
        '&:hover': {
          backgroundColor: 'white',
          boxShadow: '2px 2px 2px 2px rgba(0, 0, 0, 0.2)',
        }
      }
    },
    MuiFormLabel: {
      root: {
        color: 'white',
        '&:focus': {
          color: 'white'
        }
      }
    },
    MuiInput: {
      root: {
        fontSize: '24px',
        color: 'white',
        borderBottom: '0.5px solid white',
        '&:focus': {
          color: 'white'
        }
      }
    },
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
