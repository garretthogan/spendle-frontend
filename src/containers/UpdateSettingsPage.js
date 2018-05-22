import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InputField from '../components/InputField';
import Grow from 'material-ui/transitions/Grow';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { saveBudget } from '../api/plaid';
import { setValue } from '../actions';

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
    paddingTop: 12,
    paddingBottom: 6,
    fontSize: 18
  },
  buttonContainer: {
    textAlign: 'right',
    paddingTop: 24,
    paddingRight: 12
  },
  actionComplete: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '45%',
    fontSize: 24,
    textAlign: 'center'
  },
  select: {
    width: '90%',
    paddingTop: 6,
    paddingBottom: 12,
    fontSize: 18,
    color: 'white',
    outlineWidth: 0,
    '&;focus': {
      outlineWidth: 0,
    }
  },
  underline: {
    width: '95%',
    height: 1,
    position: 'absolute',
    left: '0%',
    top: '85%',
    borderBottom: '1px solid white',
  }  
});

const FREQS = { DAILY: 1, WEEKLY: 2 };

class UpdateSettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPhoneNumberValid: props.phoneNumber > 0,
      updateFrequency: FREQS.DAILY,
      saving: false,
      loading: false,
      saved: false,
    }
  }
  handleInput = (event) => {
    this.props.actions.setValue('phoneNumber', event.target.value);
    this.setState({
      isPhoneNumberValid: event.target.value > 0,
    });
  }
  configureUpdates = () => {
    const { userId, incomeAfterBills, targetSavingsPercentage, phoneNumber, spentThisMonth, match: { params: { accessToken } } } = this.props;
    this.setState({
      saving: true,
    });
    saveBudget({userId, incomeAfterBills, targetSavingsPercentage, phoneNumber, spentThisMonth, accessToken}).then(res => {
      this.setState({
        saving: false,
      });
    });
  }
  render() {
    const { classes, phoneNumber } = this.props;
    const { saving, loading, saved, isPhoneNumberValid } = this.state;
    return (
      <div className={classes.container}>
        <InputField
          enter={!saving && !saved && !loading}
          exit={saving}
          adornment='+'
          prompt={`What's your phone number? Spendle will only use this to send you updates on your progress as frequently as you would like.`}
          type="number"
          value={phoneNumber}
          onChange={this.handleInput}
        />
        <Grow in={isPhoneNumberValid && !saving && !saved} exit={saving} timeout={{enter: 1500, exit: 1000}}>
          <div className={classes.buttonContainer}>
            <Button onClick={this.configureUpdates}>Update Me</Button>
          </div>
        </Grow>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({setValue}, dispatch)
});

const mapStateToProps = state => ({
  userId: state.userId,
  phoneNumber: state.phoneNumber,
  targetSavingsPercentage: state.targetSavingsPercentage,
  incomeAfterBills: state.incomeAfterBills,
  spentThisMonth: state.spentThisMonth,
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UpdateSettingsPage));
