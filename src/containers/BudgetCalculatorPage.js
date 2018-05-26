import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from 'material-ui/styles';
import Grow from 'material-ui/transitions/Grow';
import Button from 'material-ui/Button';
import Loading from '../components/Loading';
import InputField from '../components/InputField';
import {
  setValue,
} from '../actions';

const targetSavings = (monthlyIncome, targetSavingsPercentage) =>
  monthlyIncome * (targetSavingsPercentage * 0.01);

const perMonth = (monthlyIncome, targetSavingsPercentage) =>
  monthlyIncome - targetSavings(monthlyIncome, targetSavingsPercentage);

const perWeek = (monthlyIncome, targetSavingsPercentage) =>
  perMonth(monthlyIncome, targetSavingsPercentage) / 4;

const perDay = (monthlyIncome, targetSavingsPercentage, daysInMonth) =>
  perMonth(monthlyIncome, targetSavingsPercentage) / daysInMonth;

const styles = () => ({
  container: {
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
    fontSize: 18,
  },
  buttonContainer: {
    textAlign: 'right',
    paddingTop: 36,
    paddingRight: 12,
  },
  goalSaved: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '45%',
    fontSize: 24,
    textAlign: 'center',
  },
});

class BudgetCalculatorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      saved: false,
    };
  }
  handleInput = prop => (event) => {
    this.props.actions.setValue(prop, event.target.value);
  }
  configureUpdates = () => {
    this.props.history.push('/update_settings/');
  }
  render() {
    const { classes, incomeAfterBills, targetSavingsPercentage } = this.props;
    const { saving, saved } = this.state;
    return (
      <div className={classes.container}>
        <Loading loading={saving} />
        <Grow
          in={saved}
          timeout={{
            enter: 1500,
            exit: 1500,
          }}
        >
          <div className={classes.goalSaved}>
            Coming soon!
          </div>
        </Grow>
        <InputField
          enter={!saving && !saved}
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
        <Grow
          in={incomeAfterBills > 0 && targetSavingsPercentage > 0 && !saving && !saved}
          exit={saving}
          timeout={{ enter: 1500, exit: 1000 }}
        >
          <div className={classes.promptContainer}>
            <div className={classes.prompt}>
              To reach your goal of saving
              ${targetSavings(incomeAfterBills, targetSavingsPercentage).toFixed(0)} you
              should only spend
              ${perMonth(incomeAfterBills, targetSavingsPercentage).toFixed(0)} per month.
              That's ${perWeek(incomeAfterBills, targetSavingsPercentage).toFixed(0)} per week,
              or ${
                perDay(incomeAfterBills, targetSavingsPercentage, moment().daysInMonth()).toFixed(0)
              } per day.
            </div>
          </div>
        </Grow>
        <Grow
          in={incomeAfterBills > 0 && targetSavingsPercentage > 0 && !saving && !saved}
          exit={saving}
          timeout={{ enter: 1500, exit: 1000 }}
        >
          <div className={classes.buttonContainer}>
            <Button onClick={this.configureUpdates}>Update Me</Button>
          </div>
        </Grow>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setValue }, dispatch),
});

const mapStateToProps = state => ({
  plaidAccessToken: state.plaidAccessToken,
  transactions: state.transactions,
  incomeAfterBills: state.incomeAfterBills,
  targetSavingsPercentage: state.targetSavingsPercentage,
  phoneNumber: state.phoneNumber,
  userId: state.userId,
  spentThisMonth: state.spentThisMonth,
});

const styled = withStyles(styles)(BudgetCalculatorPage);

export default connect(mapStateToProps, mapDispatchToProps)(styled);
