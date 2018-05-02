import React, { Component } from 'react';
import Input from 'material-ui/Input';
import Grow from 'material-ui/transitions/Grow';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  form: {
    top: '40%',
    left: '10%',
    width: '80%',
  },
  field: {
    display: 'inline-blick',
    color: 'white',
  },
  label: {
    color: 'white',
  },
  submit: {
    paddingTop: 16,
    textAlign: 'center',
  },
  adornment: {
    padding: '6px',
  },
  budgetSaved: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
  }
});
/**
 * To do:
 * - Insert comma based on budget value (1,000 10,000 etc)
 * - Post budget to database
 */
class CreateBudgetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      showSubmit: false,
      fadeOut: false,
      showSuccess: false,
    };
  }
  handleChange = (prop) => event => {
    const amount = event.target.value;

    this.setState({
      [prop]: amount,
      showSubmit: amount > 0,
    });
  }
  saveBudget = () => {
    this.setState({
      fadeOut: true,
    });
    setTimeout(() => {
      this.setState({
        showSuccess: true,
      });
    }, 1000);
  }
  render() {
    const { classes }= this.props;
    return (
      <div className={classes.root}>
        <Grow timeout={{enter: 1500, exit: 1000}} in={!this.state.fadeOut} exit={this.state.fadeOut}>
          <FormControl className={classes.form} >
            <Typography variant="title" className={classes.label}>Goal</Typography>
            <Input
              disableUnderline
              className={classes.field}
              id="adornment-amount"
              value={this.state.amount}
              onChange={this.handleChange('amount')}
              startAdornment={<span className={classes.adornment}>$</span>}
            />
            <Grow in={this.state.showSubmit} timeout={{enter: 1500, exit: 750}}>
              <div className={classes.submit}>
                <Button onClick={this.saveBudget}>
                  Save
                </Button>
              </div>
            </Grow>
          </FormControl>
        </Grow>
        <Grow timeout={{enter: 1500, exit: 1000}} in={this.state.showSuccess}>
          <div className={classes.budgetSaved}>Budget saved!</div>
        </Grow>
      </div>
    )
  }
}

export default withStyles(styles)(CreateBudgetPage);
