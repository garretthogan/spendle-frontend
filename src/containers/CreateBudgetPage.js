import React, { Component } from 'react';
import Input from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  form: {
    top: '45%',
    left: '10%',
    width: '80%',
  },
  field: {
    color: 'white',
  },
  adornment: {
    color: 'white',
  }
});

class CreateBudgetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
    };
  }
  handleChange = (prop) => event => {
    this.setState({[prop]: event.target.value});
  }
  render() {
    const { classes }= this.props;
    return (
      <div className={classes.root}>
        <FormControl className={classes.form} >
          <Input
            disableUnderline
            className={classes.field}
            id="adornment-amount"
            value={this.state.amount}
            onChange={this.handleChange('amount')}
          />
        </FormControl>
      </div>
    )
  }
}

export default withStyles(styles)(CreateBudgetPage);
