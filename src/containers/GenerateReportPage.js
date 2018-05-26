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
    paddingTop: 12,
  },
  reportContainer: {
    position: 'absolute',
    textAlign: 'center',
    top: '40%',
    left: '10%',
    width: '80%',
    fontSize: 18,
    color: 'white',
  },
});

const getUpdateText = (amount, budget, goal) => {
  const diff = budget - amount;
  const daysRemaining = moment().endOf('month').diff(moment(), 'days');
  const dailyBudget = diff / daysRemaining;
  return diff < 0 ?
    ` That's $${diff.toFixed(0) * -1} over your budget!
     Try to limit yourself to about $15 per day.` :
    ` You have about $${(diff).toFixed(0)} remaining in your budget for the month
     You should only spend $${dailyBudget} if you still want to reach your goal of saving $${goal}.`;
};

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
  'Deposit',
  'Telecommunication Services',
  'Education',
  'Bank Fees',
];

class GenerateReportPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      budget: 0,
      amountSpent: 0,
      targetSavings: 0,
    };
  }
  componentDidMount() {
    if (this.props.plaidAccessToken) {
      this.generateReport();
    } else {
      this.props.history.push('/');
    }
  }
  configureBudget = () => {
    this.props.history.push('/goal');
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
      const targetSavings = (incomeAfterBills * (targetSavingsPercentage * 0.01)).toFixed(2);
      const budget = incomeAfterBills - targetSavings;
      this.setState({
        targetSavings,
        budget,
        amountSpent,
        loading: false,
      });
    });
  }
  render() {
    const { classes } = this.props;
    const {
      amountSpent,
      loading,
      budget,
      targetSavings,
    } = this.state;

    return (
      <div className={classes.container}>
        <Loading loading={loading} />
        <Grow
          in={!loading && amountSpent > 0}
          timeout={{
            enter: 1500,
            exit: 1000,
          }}
        >
          <div className={classes.reportContainer}>
            <div>
              Looks like you've spent about ${amountSpent} this month.
              {getUpdateText(amountSpent, budget, targetSavings)}
            </div>
            <div className={classes.buttonContainer}>
              <Button
                onClick={this.configureBudget}
              >
                Configure Budget
              </Button>
            </div>
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
