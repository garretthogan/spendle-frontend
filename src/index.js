import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import state from './reducers';
import {Provider} from 'react-redux';

const store = createStore(state);
const theme = createMuiTheme();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
