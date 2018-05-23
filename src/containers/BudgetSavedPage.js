import React, { Component } from 'react';
import Grow from 'material-ui/transitions/Grow';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  container: {
    color: 'white',
    textAlign: 'center',
    height: '100%',
  },
  savedText: {
    position: 'absolute',
    width: '100%',
    top: '45%',
    fontSize: 24,
  }
});

class BudgetSavedPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Grow
          in={true}
          timeout={{
            enter: 1000
          }}
        >
          <div className={classes.savedText}>
            Budget saved!
          </div>
        </Grow>
      </div>
    )
  }
}

export default withStyles(styles)(BudgetSavedPage);
