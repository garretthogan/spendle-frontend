import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { setUserAccessToken, setPlaidAccessToken, setUser, setUserId } from './actions';
import { getUser } from './api/plaid';
import BankAccessPage from './containers/BankAccessPage';
import BudgetCalculatorPage from './containers/BudgetCalculatorPage';
import UpdateSettingsPage from './containers/UpdateSettingsPage';
import LoginPage from './containers/LoginPage';
import BudgetSavedPage from './containers/BudgetSavedPage';
import GenerateReportPage from './containers/GenerateReportPage';
import './App.css';

const STATUS = {
  NOT: 'not_authorized',
  CONNECTED: 'connected',
  UNKNOWN: 'unknown',
};

const styles = () => ({
  main: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
});

class App extends Component {
  componentDidMount() {
    window.FB.init({
      appId: '439630353141475',
      status: true,
      xfbml: true,
      version: 'v2.7',
    });
    window.FB.getLoginStatus(({ authResponse, status }) => {
      if (status === STATUS.NOT || status === STATUS.UNKNOWN) {
        this.props.history.push('/');
      } else if (authResponse) {
        this.props.actions.setUserAccessToken(authResponse.accessToken);
        getUser(authResponse.userID, authResponse.accessToken).then((user) => {
          if (user.userExists) {
            this.props.actions.setPlaidAccessToken(user.plaidAccessToken);
            this.props.actions.setUser(user);
            this.props.history.push('/generate_report/');
          } else {
            this.props.actions.setUserId(authResponse.userID);
            this.props.history.push('/connect_bank/');
          }
        });
      }
    });
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.main}>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/connect_bank" component={BankAccessPage} />
        <Route exact path="/saved" component={BudgetSavedPage} />
        <Route exact path="/goal/" component={BudgetCalculatorPage} />
        <Route exact path="/update_settings/" component={UpdateSettingsPage} />
        <Route exact path="/generate_report/" component={GenerateReportPage} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    setUserAccessToken,
    setPlaidAccessToken,
    setUser,
    setUserId,
  }, dispatch),
});

const mapStateToProps = () => ({ });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App)));
