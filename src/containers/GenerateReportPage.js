import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Grow from 'material-ui/transitions/Grow';
import Loading from '../components/Loading';
import { getTransactions } from '../api/plaid';

const styles = () => ({
  container: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  reportContainer: {
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    width: '100%',
    fontSize: 18,
    color: 'white',
  },
});

const recurringTransactionKeys = [
  'Payment',
  'Utilities',
  'Subscription',
  'Rent',
  'Square Cash',
  'Student Aid and Grants',
  'Loans and Mortgages',
  'Internal Account Transfer',
  'Transfer',
  'Telecommunication Services',
  'Education',
  'Bank Fees',
];

class GenerateReportPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      amountSpent: 0,
    };
  }
  generateReport = () => {
    const { incomeAfterBills, targetSavingsPercentage, plaidAccessToken } = this.props;
    this.setState({
      loading: true,
    });

    const start = moment().startOf('month').format('YYYY-MM-DD');
    const end = moment().format('YYYY-MM-DD');

    getTransactions(plaidAccessToken, { start, end }).then((transactions) => {
      const filteredTransactions = transactions.filter((t) => {
        const filteredCategories = t.category.filter(c =>
          recurringTransactionKeys.some(r => r === c));
        return !(filteredCategories.length > 0);
      });

      const amountSpent = (filteredTransactions.map(t =>
        t.amount).reduce((total, current) => total + current)).toFixed(0);

      this.setState({
        amountSpent,
        loading: false,
      });

      console.log({ amountSpent, incomeAfterBills, targetSavingsPercentage });
    });
    // get transactions in the last month
    // filter out recurring ones
    // show how much we have spent this month
    // show how much of our budget is remaining
    // show how much of that we can spend each day
  }
  render() {
    const { classes } = this.props;
    const { amountSpent, loading } = this.state;
    return (
      <div className={classes.container}>
        <Loading loading={this.state.loading} />
        <Grow
          in={!loading && amountSpent === 0}
          exit={loading}
          timeout={{
            enter: 1500,
            exit: 1000,
          }}
        >
          <Button
            onClick={this.generateReport}
          >
            Show Progress
          </Button>
        </Grow>
        <Grow
          in={!loading && amountSpent > 0}
          timeout={{
            enter: 1500,
            exit: 1000,
          }}
        >
          <div className={classes.reportContainer}>
            Looks like you've spent about ${amountSpent} this month.
          </div>
        </Grow>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  targetSavingsPercentage: state.targetSavingsPercentage,
  incomeAfterBills: state.incomeAfterBills,
  plaidAccessToken: state.plaidAccessToken,
});

export default connect(mapStateToProps)(withStyles(styles)(GenerateReportPage));
