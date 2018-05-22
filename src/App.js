import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import BankAccessPage from './containers/BankAccessPage';
import BudgetCalculatorPage from './containers/BudgetCalculatorPage';
import UpdateSettingsPage from './containers/UpdateSettingsPage';
import LoginPage from './containers/LoginPage';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

const STATUS = {
  NOT: 'not_authorized',
  CONNECTED: 'connected',
  UNKNOWN: 'unknown'
};

const styles = theme => ({
  main: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden'
  }
});

class App extends Component {
  componentDidMount() {
    if(window.FB) {
      window.FB.getLoginStatus(({status, authResponse}) => {
        if(status === STATUS.NOT || status === STATUS.UNKNOWN) {
          this.props.history.push(`/`);
        }
      });
    }
  }
  render () {
    const { classes } = this.props;

    return (
      <Router>
        <div className={classes.main}>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/connect_bank" component={BankAccessPage} />
          <Route exact path="/goal/:accessToken" component={BudgetCalculatorPage} />
          <Route exact path="/update_settings/:accessToken" component={UpdateSettingsPage} />
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
