import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Grow from 'material-ui/transitions/Grow';

const styles = () => ({
  container: {
    position: 'absolute',
    width: '80%',
    height: '100%',
    left: '10%',
    top: '40%',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 12,
  },
});

class TopExpensesPage extends Component {
  openProgressReport = () => {
    this.props.history.push('/generate_report/');
  }
  render() {
    const { classes, topTransactions } = this.props;
    return (
      <div className={classes.container}>
        <Grow
          in
          timeout={{
            enter: 1500,
            exit: 1000,
          }}
        >
          <div>
            Some of your notable transactions are {topTransactions[0]},&nbsp;
            {topTransactions[1]} and {topTransactions[2]}.
            <div className={classes.buttonContainer}>
              <Button onClick={this.openProgressReport}>Progress Report</Button>
            </div>
          </div>
        </Grow>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  topTransactions: state.topTransactions,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TopExpensesPage));
