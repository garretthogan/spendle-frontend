import React from 'react';
import { withStyles } from 'material-ui/styles';
import BankAccessPage from './containers/BankAccessPage';
import TransactionsPage from './containers/TransactionsPage';
import CreateBudgetPage from './containers/CreateBudgetPage';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

const styles = theme => ({
  main: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  }
});

const App = (props) => {
  const { classes } = props;
  return (
    <Router>
      <div className={classes.main}>
        <Route exact path="/" component={BankAccessPage} />
        <Route exact path="/transactions/:accessToken" component={TransactionsPage} />
        <Route exact path="/create-budget/:accessToken" component={CreateBudgetPage} />
      </div>
    </Router>
  );
}

export default withStyles(styles)(App);
