import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Grow from 'material-ui/transitions/Grow';
import Loading from '../components/Loading';
import { generateReport } from '../api/plaid';
import { setProgressReport } from '../actions';

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
    top: '30%',
    left: '10%',
    width: '80%',
    fontSize: 18,
    color: 'white',
  },
});

const getUpdateText = (remainingBudget, dailyBudget, targetSavings) => (remainingBudget < 0 ?
  ` That's $${remainingBudget.toFixed(0) * -1} over your budget!
    Try to limit yourself to about $15  today.` :
  ` You have about $${(remainingBudget).toFixed(0)} remaining in your budget.
    You should only spend $${dailyBudget.toFixed(0)} today if you still want to reach your goal of saving $${targetSavings.toFixed(2)}.`);

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
    };
  }
  componentDidMount() {
    if (this.props.plaidAccessToken) {
      if (this.props.totalSpent === 0) {
        this.generateReport();
      }
    } else {
      this.props.history.push('/');
    }
  }
  openTopExpenses = () => {
    this.props.history.push('/top_expenses/');
  }
  openBudgetSettings = () => {
    this.props.history.push('/goal/');
  }
  generateReport = () => {
    const data = {
      start_date: moment().startOf('month'),
      end_date: moment().endOf('month'),
      filters: recurringTransactionKeys,
      user_id: this.props.userId,
      access_token: this.props.plaidAccessToken,
      user_access_token: this.props.userAccessToken,
    };
    this.setState({ loading: true });
    generateReport(data).then((report) => {
      this.setState({ loading: false });
      this.props.actions.setProgressReport(report);
    });
  }
  render() {
    const {
      classes,
      totalSpent,
      targetSavings,
      remainingBudget,
      spentLastWeek,
      dailyBudget,
    } = this.props;

    const {
      loading,
    } = this.state;

    return (
      <div className={classes.container}>
        <Loading loading={loading} />
        <Grow
          in={!loading && totalSpent > 0}
          timeout={{
            enter: 1500,
            exit: 1000,
          }}
        >
          <div className={classes.reportContainer}>
            <div>
              Looks like you've spent about ${totalSpent} this month, and&nbsp;
              ${spentLastWeek.toFixed(2)} last week.&nbsp;
              {getUpdateText(remainingBudget, dailyBudget, targetSavings)}
            </div>
            <div className={classes.buttonContainer}>
              <Button
                onClick={this.openBudgetSettings}
              >
                Budget Settings
              </Button>
            </div>
            <div className={classes.buttonContainer}>
              <Button
                onClick={this.openTopExpenses}
              >
                Top Expenses
              </Button>
            </div>
          </div>
        </Grow>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plaidAccessToken: state.plaidAccessToken,
  userAccessToken: state.userAccessToken,
  userId: state.userId,
  totalSpent: state.totalSpent,
  spentLastWeek: state.spentLastWeek,
  spentYesterday: state.spentYesterday,
  dailyBudget: state.dailyBudget,
  remainingBudget: state.remainingBudget,
  targetSavings: state.targetSavings,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setProgressReport }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GenerateReportPage));
