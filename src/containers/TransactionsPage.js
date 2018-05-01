import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import {bindActionCreators} from 'redux';
import {onTransactionsLoaded} from '../actions';
import { connect } from 'react-redux';
import { getTransactions } from '../api/plaid';

const styles = theme => ({
  root: {
    height: '100%',
  },
  tableContainer: {
    width: '100%',
    top: '42.5%',
    position: 'absolute',
    overflowX: 'hidden',
  },
  heading: {
    textAlign: 'center',
    padding: 16,
    color: 'white',
  },
  transactions: {
    padding: 16,
  },
  buttonContainer: {
    position: 'absolute',
    left: '10%',
    width: '80%',
    height: '100%',
    textAlign: 'center',
  } 
});

class TransactionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showCreateBudget: false,
      fadeOut: false,
    }
  }
  componentDidMount() {
    const {
      match: {
        params: {
          accessToken
        }
      },
      actions: {
        onTransactionsLoaded
      }
    } = this.props;
    getTransactions(accessToken).then((transactions) => {
      onTransactionsLoaded(transactions);
      this.setState({loading: false});
    });

    setTimeout(() => {
      this.setState({
        showCreateBudget: true,
      });
    }, 2000);
  }
  createBudget = () => {
    const { match: { params: { accessToken } }, history } = this.props;
    this.setState({
      fadeOut: true,
    });
    setTimeout(() => {
      history.push(`/create-budget/${accessToken}`);
    }, 1250);
  }
  renderTable = () => {
    const { classes, transactions } = this.props;
    const { loading, fadeOut } = this.state;
    const amounts = !loading ? transactions.map(t => t.amount) : 0;
    const total = !loading ? amounts.reduce((a, b) => (a + b), 0) : 0;
    const fadeIn = !loading && !fadeOut;

    return (
      <Slide
        direction="left"
        exit={fadeOut}
        in={fadeIn}
        timeout={{
          enter: 1000,
          exit: 1000
        }}
      >
        <div elevation={6}>
          <Typography className={classes.heading} variant="title" component="h3">
            You've spent about <b>${total.toFixed(0)}</b> this month!
          </Typography>
        </div>
      </Slide>
    );
  }
  render() {
    const { classes } = this.props;
    const { loading, showCreateBudget, fadeOut } = this.state;
    const fadeIn = (!loading && showCreateBudget && !fadeOut);
    return (
      <div className={classes.root}>
        <div className={classes.tableContainer}>
         {this.renderTable()}
        </div>
        <Slide
          in={fadeIn}
          exit={fadeOut}
          direction="right"
          timeout={{
            enter: 1000,
            leave: 1000
          }}
        >
          <div className={classes.buttonContainer}>
            <Button onClick={this.createBudget} >
              Create a budget
            </Button>
          </div>
        </Slide>
      </div>
    );    
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.accessToken,
  transactions: state.transactions,
});

const mapDispatchProps = (dispatch) => ({
  actions: bindActionCreators({onTransactionsLoaded}, dispatch),
});

export default connect(mapStateToProps, mapDispatchProps)(withStyles(styles)(TransactionsPage));
