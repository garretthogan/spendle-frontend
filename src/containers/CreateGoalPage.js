import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Grow from 'material-ui/transitions/Grow';
import Input from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '80%',
    height: '100%',
    top: '40%',
    left: '10%',
    textAlign: 'center',
    color: 'white',
    overflow: 'hidden',
  },
  textContent: {
    paddingTop: 12,
    paddingBottom: 12,
    color: 'white',
    overflow: 'hidden',
  },
  setBudgetField: {
    position: 'absolute',
    top: '0%',
  },
  input: {
    paddingLeft: 24,
    width: '30%',
  },
  adornment: {
    padding: '6px',
  },  
});

class CreateGoalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      createGoal: false,
    };
  }
  componentDidMount() {
    this.setState({
      loading: false,
    })
  }
  setGoal = () => {
    this.setState({
      createGoal: true,
    });
  }
  render() {
    const { classes } = this.props;
    const { loading, createGoal } = this.state;
    return (
      <div className={classes.root}>
        <Grow
          in={!loading && !createGoal}
          exit={createGoal}
          timeout={{
            enter: 1500,
            exit: 1000
          }}
        >
          <div>
            <Typography variant="title" className={classes.textContent}>
              You have no goal right now, would you like to set one?
            </Typography>
            <Button onClick={this.setGoal}>Set goal</Button>
          </div>
        </Grow>
        <Grow
          in={createGoal}
          timeout={{
            enter: 2000,
            exit: 1500
          }}
        >
          <div className={classes.setBudgetField}>
            <Typography className={classes.textContent} variant="title">How much would you like to save this month?</Typography>
            <Input
              disableUnderline
              className={classes.input}
              endAdornment={<span className={classes.adornment}>%</span>}
            />
          </div>
        </Grow>
      </div>
    );
  }
}

export default withStyles(styles)(CreateGoalPage);
