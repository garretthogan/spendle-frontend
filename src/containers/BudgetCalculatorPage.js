import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from 'material-ui/styles';
import Grow from 'material-ui/transitions/Grow';
import Button from 'material-ui/Button';
import Loading from '../components/Loading';
import InputField from '../components/InputField';
import { getTransactionsInRange, saveBudget } from '../api/plaid';
import {
  onTransactionsLoaded,
  setValue
} from '../actions';

const isNotSquareCashExpense = transaction =>
  !transaction.category.some(c => c === 'Square Cash') ||
  (transaction.category.some(c => c === 'Square Cash') && transaction.amount > 800);

const filterTransactions = (key, value) => {
  return (transaction) => {
    if(Array.isArray(value) && Array.isArray(transaction[key])) {
      return value.some(v => transaction[key].some(prop => prop === v));
    }
    else if(Array.isArray(value)) {
      value.some(v => v === transaction[key]);
    }
    else if(Array.isArray(transaction[key])) {
      return transaction[key].some(prop => prop === value);
    }
    return transaction[key] === value;
  }
}

const filterKeys = ['Payment', 'Utilities', 'Subscription', 'Rent', 'Square Cash', 'Student Aid and Grants', 'Loans and Mortgages'];

const averageMonthlyIncome = (transactions, numberOfMonths) => {
  const filteredByPayroll = transactions.filter(filterTransactions('category', 'Deposit'));
  const mappedPayments = filteredByPayroll.map(payment => payment.amount);
  return (mappedPayments.reduce((accumulator, currentValue) => accumulator + currentValue) / numberOfMonths).toFixed(2);  
}

const averageMonthlyExpenses = (transactions, numberOfMonths) => {
  const excludingSquareCashExpense = transactions.filter(isNotSquareCashExpense);
  const filteredByPayments = excludingSquareCashExpense.filter(filterTransactions('category', filterKeys));
  const mappedPayments = filteredByPayments.map(payment => payment.amount);
  return (mappedPayments.reduce((accumulator, currentValue) => accumulator + currentValue) / numberOfMonths).toFixed(2);
}

const perMonth = (monthlyIncome, targetSavingsPercentage) => {
  return monthlyIncome - targetSavings(monthlyIncome, targetSavingsPercentage);
}

const perWeek = (monthlyIncome, targetSavingsPercentage) => {
  return perMonth(monthlyIncome, targetSavingsPercentage) / 4;
}

const perDay = (monthlyIncome, targetSavingsPercentage, daysInMonth) => {
  return perMonth(monthlyIncome, targetSavingsPercentage) / daysInMonth;
}

const targetSavings = (monthlyIncome, targetSavingsPercentage) => {
  return monthlyIncome * (targetSavingsPercentage * 0.01);
}

const styles = theme => ({
  container : {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '80%',
    color: 'white',
  },
  promptContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  prompt: {
    fontSize: 18
  },
  buttonContainer: {
    textAlign: 'right',
    paddingTop: 36,
    paddingRight: 12
  },
  goalSaved: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '45%',
    fontSize: 24,
    textAlign: 'center'
  }
});

const RANGE = 6;

class BudgetCalculatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthlyIncome: 0,
      targetSavingsPercentage: 0,
      loading: true,
      saving: false,
      saved: false,
    };
  }
  componentDidMount() {
    const { match: { params: { accessToken } }, actions: { onTransactionsLoaded, setValue } } = this.props;
    getTransactionsInRange(accessToken, RANGE).then((transactions) => {
      const monthlyExpenses = averageMonthlyExpenses(transactions, RANGE);
      this.setState({
        loading: false,
      });
      setValue('incomeAfterBills', ((averageMonthlyIncome(transactions, RANGE) * -1) - monthlyExpenses).toFixed(2))
      onTransactionsLoaded(transactions);
    });
  }
  handleInput = (prop) => (event) => {
    this.props.actions.setValue(prop, event.target.value);
  }
  saveGoal = () => {
    const { incomeAfterBills, targetSavingsPercentage, phoneNumber, userId, spentThisMonth } = this.props;
    saveBudget({incomeAfterBills, targetSavingsPercentage, phoneNumber, userId, spentThisMonth}).then(res => {
      console.log('hit');
      this.props.history.push(`/update_settings/`);
    });
    this.setState({
      saving: true,
    });
  }
  render() {
    const { classes, incomeAfterBills, targetSavingsPercentage } = this.props;
    const { saving, saved, loading } = this.state;

    return (
      <div className={classes.container}>
        <Loading loading={saving || loading} />
        <Grow
          in={saved}
          timeout={{
            enter: 1500,
            exit: 1500
          }}
        >
          <div className={classes.goalSaved}>
            Coming soon!
          </div>
        </Grow>
        <InputField
          enter={!saving && !saved && !loading}
          exit={saving}
          prompt={`After bills and recurring expenses, it looks like you make about $${incomeAfterBills} per month. Feel free to adjust that value below.`}
          adornment="$"
          type="number"
          value={incomeAfterBills}
          onChange={this.handleInput('incomeAfterBills')}
        />
        <InputField
          enter={incomeAfterBills > 0 && !saving && !saved}
          exit={saving}
          prompt="How much of that would you like to save?"
          adornment="%"
          type="number"
          value={targetSavingsPercentage}
          onChange={this.handleInput('targetSavingsPercentage')}
        />
        <Grow in={incomeAfterBills > 0 && targetSavingsPercentage > 0 && !saving && !saved} exit={saving} timeout={{enter: 1500, exit: 1000}}>
          <div className={classes.promptContainer}>
            <div className={classes.prompt}>
              To reach your goal of saving ${targetSavings(incomeAfterBills, targetSavingsPercentage).toFixed(0)} you should only spend ${perMonth(incomeAfterBills, targetSavingsPercentage).toFixed(0)} per month.
              That's ${perWeek(incomeAfterBills, targetSavingsPercentage).toFixed(0)} per week,
              or ${perDay(incomeAfterBills, targetSavingsPercentage, moment().daysInMonth()).toFixed(0)} per day.
            </div>
          </div>
        </Grow>
        <Grow in={incomeAfterBills > 0 && targetSavingsPercentage > 0 && !saving && !saved} exit={saving} timeout={{enter: 1500, exit: 1000}}>
          <div className={classes.buttonContainer}>
            <Button onClick={this.saveGoal}>Save Goal</Button>
          </div>
        </Grow>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({onTransactionsLoaded, setValue}, dispatch)
});

const mapStateToProps = state => ({
  transactions: state.transactions,
  incomeAfterBills: state.incomeAfterBills,
  targetSavingsPercentage: state.targetSavingsPercentage,
  phoneNumber: state.phoneNumber,
  userId: state.userId,
  spentThisMonth: state.spentThisMonth
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BudgetCalculatorPage));
