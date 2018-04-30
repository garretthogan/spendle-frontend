import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import {getPublicKey, getAccessToken, getTransactions} from './api/plaid';
import TransactionTable from './components/TransactionTable';
import {plaidEnv} from './config';
import './App.css';

const styles = theme => ({
  landing: {
    height: '100%'
  },
  button: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    color: 'white',
    top: '50%',
    borderRadius: 500,
  },
  buttonContainer: {
    height: '100%',
    textAlign: 'center',
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      handler: null,
      accessToken: null,
      transactions: [],
    };
  }
  componentDidMount() {
    getPublicKey().then(({public_key}) => {
      const handler = window.Plaid.create({
        apiVersion: 'v2',
        clientName: 'Spendle',
        env: plaidEnv,
        product: ['transactions'],
        key: public_key,
        onSuccess: this.onSuccess,
      });
      this.setState({
        handler,
      });      
    });
  }
  onSuccess = (token, metadata) => {
    getAccessToken(token).then(({access_token}) => {
      this.setState({
        accessToken: access_token,
      });
      getTransactions(access_token).then(transactions => {
        this.setState({
          transactions,
        });
      });
    });
  }
  openBankSelector = () => {
    this.state.handler.open();
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.landing}>
        {(this.state.transactions.length === 0) && <div className={classes.buttonContainer}><Button className={classes.button} onClick={this.openBankSelector}>Link an account</Button></div>}
        {this.state.transactions.length > 0 && <TransactionTable transactions={this.state.transactions} />}
      </div>
    );
  }
}

export default withStyles(styles)(App);
