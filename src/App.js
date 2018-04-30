import React from 'react';
import { withStyles } from 'material-ui/styles';
import BankAccessPage from './containers/BankAccessPage';
import TransactionsPage from './containers/TransactionsPage';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

const styles = theme => ({
  main: {
    height: '100%'
  }
});

const App = (props) => {
  const { classes } = props;
  return (
    <Router>
      <div className={classes.main}>
        <Route exact path="/" component={BankAccessPage} />
        <Route exact path="/transactions/:accessToken" component={TransactionsPage} />
      </div>
    </Router>
  );
}

export default withStyles(styles)(App);
