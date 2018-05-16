import React from 'react';
import { withStyles } from 'material-ui/styles';
import BankAccessPage from './containers/BankAccessPage';
import BudgetCalculatorPage from './containers/BudgetCalculatorPage';
import UpdateSettingsPage from './containers/UpdateSettingsPage';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

const styles = theme => ({
  main: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden'
  }
});

const App = (props) => {
  const { classes } = props;
  return (
    <Router>
      <div className={classes.main}>
        <Route exact path="/" component={BankAccessPage} />
        <Route exact path="/goal/:accessToken" component={BudgetCalculatorPage} />
        <Route exact path="/update_settings" component={UpdateSettingsPage} />
      </div>
    </Router>
  );
}

export default withStyles(styles)(App);
