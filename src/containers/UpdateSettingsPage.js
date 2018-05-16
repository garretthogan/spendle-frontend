import React, { Component } from 'react';
import InputField from '../components/InputField';
import Grow from 'material-ui/transitions/Grow';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

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
      emailAddress: '',
      isEmailValid: false,
      updateFrequency: FREQS.DAILY,
      saving: false,
      loading: false,
      saved: false,
    }
  }
  handleInput = (event) => {
    this.setState({
      emailAddress: event.target.value,
      isEmailValid: true,
    });
  }
  selectFrequency = (event) => {

  }
  configureUpdates = () => {
    this.setState({
      saving: true,
    });
  }
  render() {
    const { classes } = this.props;
    const { emailAddress, saving, loading, saved, isEmailValid } = this.state;
    return (
      <div className={classes.container}>
        <InputField
          enter={!saving && !saved && !loading}
          exit={saving}
          prompt={`What's your email address? Spendle will only use this to send you updates on your progress as frequently as you would like.`}
          type="email"
          value={emailAddress}
          onChange={this.handleInput}
        />
        <Grow
          in={!saving && !saved && !loading && isEmailValid}
          exit={saving}
          timeout={{ enter: 1500, exit: 1000 }}
        >
          <div className={classes.promptContainer}>
            <div className={classes.prompt}>
              Update Frequency
            </div>
            <select
              className={classes.select}
              value={this.state.updateFrequency}
              onChange={this.selectFrequency}
            >
              <option value={FREQS.DAILY}>Daily</option>
              <option value={FREQS.WEEKLY}>Weekly</option>
            </select>
            <span className={classes.underline}></span>
          </div>
        </Grow>
        <Grow in={isEmailValid && !saving && !saved} exit={saving} timeout={{enter: 1500, exit: 1000}}>
          <div className={classes.buttonContainer}>
            <Button onClick={this.configureUpdates}>Update Me</Button>
          </div>
        </Grow>
      </div>
    );
  }
}

export default withStyles(styles)(UpdateSettingsPage);
