import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Grow from 'material-ui/transitions/Grow';
import { withStyles } from 'material-ui/styles';
import Loading from '../components/Loading';
import { getPublicKey, getAccessToken, getTransactionsInRange } from '../api/plaid';
import { plaidEnv } from '../config';
import {
  setIncomeAfterBills,
  setPlaidAccessToken,
} from '../actions';

const styles = () => ({
  buttonContainer: {
    overflow: 'hidden',
    position: 'absolute',
    left: '10%',
    width: '80%',
    height: '100%',
    textAlign: 'center',
  },
  welcomeText: {
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    top: '41%',
    textAlign: 'center',
  },
  welcomeHeader: {
    color: 'white',
  },
  welcomeBody: {
    color: 'white',
  },
});

const RANGE = 6;

const recurringTransactionKeys = [
  'Payment',
  'Utilities',
  'Subscription',
  'Rent',
  'Square Cash',
  'Student Aid and Grants',
  'Loans and Mortgages',
];

const isNotSquareCashExpense = transaction =>
  !transaction.category.some(c => c === 'Square Cash') ||
  (transaction.category.some(c => c === 'Square Cash') && transaction.amount > 800);

const filterTransactions = (key, value) => (transaction) => {
  if (Array.isArray(value) && Array.isArray(transaction[key])) {
    return value.some(v => transaction[key].some(prop => prop === v));
  } else if (Array.isArray(value)) {
    value.some(v => v === transaction[key]);
  } else if (Array.isArray(transaction[key])) {
    return transaction[key].some(prop => prop === value);
  }
  return transaction[key] === value;
};

const averageMonthlyExpenses = (transactions, numberOfMonths) => {
  const excludingSquareCashExpense = transactions.filter(isNotSquareCashExpense);
  const filteredByPayments = excludingSquareCashExpense.filter(filterTransactions('category', recurringTransactionKeys));
  const mappedPayments = filteredByPayments.map(payment => payment.amount);
  return (mappedPayments.reduce((accumulator, currentValue) =>
    accumulator + currentValue) / numberOfMonths).toFixed(2);
};

const averageMonthlyIncome = (transactions, numberOfMonths) => {
  const filteredByPayroll = transactions.filter(filterTransactions('category', 'Deposit'));
  const mappedPayments = filteredByPayroll.map(payment => payment.amount);
  return (mappedPayments.reduce((accumulator, currentValue) =>
    accumulator + currentValue) / numberOfMonths).toFixed(2);
};

class BankAccessPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handler: null,
      loading: true,
      fadeOut: false,
    };
  }
  componentDidMount() {
    this.initPlaidHandler();
  }
  onSuccess = (token) => {
    getAccessToken(token).then(({ access_token }) => {
      this.props.actions.setPlaidAccessToken(access_token);
      getTransactionsInRange(access_token, RANGE).then((transactions) => {
        if (transactions.length > 0) {
          const monthlyExpenses = averageMonthlyExpenses(transactions, RANGE);
          const monthlyIncomeInverted = averageMonthlyIncome(transactions, RANGE) * -1;
          const incomeAfterBills = (monthlyIncomeInverted - monthlyExpenses).toFixed(2);
          this.props.actions.setIncomeAfterBills(incomeAfterBills > 0 ? incomeAfterBills : 0);
        } else {
          this.props.actions.setIncomeAfterBills(0);
        }
        this.props.history.push('/goal/');
      });
    });
  }
  onExit = () => {
    this.setState({
      loading: false,
      fadeOut: false,
    });
  }
  openBankSelector = () => {
    const { handler } = this.state;
    if (handler) {
      setTimeout(() => {
        handler.open();
      }, 500);
      this.setState({
        loading: true,
        fadeOut: true,
      });
    }
  }
  initPlaidHandler = () => {
    const { userAccessToken } = this.props;
    if (userAccessToken) {
      getPublicKey(userAccessToken).then(({ public_key }) => {
        const handler = window.Plaid.create({
          apiVersion: 'v2',
          clientName: 'Spendle',
          env: plaidEnv,
          product: ['transactions'],
          key: public_key,
          onSuccess: this.onSuccess,
          onExit: this.onExit,
        });
        this.setState({
          handler,
          loading: false,
        });
      });
    } else {
      this.props.history.push('/');
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Loading loading={this.state.loading} />
        <Grow
          timeout={{
            enter: 1500,
            exit: 1000,
          }}
          in={!this.state.loading && !this.state.fadeOut}
        >
          <div className={classes.welcomeText}>
            <Typography className={classes.welcomeHeader} variant="title">Welcome to Spendle</Typography>
            <Typography className={classes.welcomeBody} variant="subheading">Connect a bank account to begin!</Typography>
          </div>
        </Grow>
        <Grow
          timeout={{
            enter: 1500,
            exit: 1000,
          }}
          in={!this.state.loading && !this.state.fadeOut}
        >
          <div className={classes.buttonContainer}>
            <Button onClick={this.openBankSelector}>
              Connect account
            </Button>
          </div>
        </Grow>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plaidAccessToken: state.plaidAccessToken,
  userId: state.userId,
  userAccessToken: state.userAccessToken,
});

const mapDispatchProps = dispatch => ({
  actions: bindActionCreators({
    setIncomeAfterBills,
    setPlaidAccessToken,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchProps)(withStyles(styles)(BankAccessPage));
