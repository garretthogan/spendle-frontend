import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import {bindActionCreators} from 'redux';
import {onTransactionsLoaded} from '../actions';
import { connect } from 'react-redux';
import { getTransactions } from '../api/plaid';
import AnimatedButton from './AnimatedButton';

const BUTTON_ANIM_DELAY = 2;

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '90%',
  },
  tableContainer: {
    width: '100%',
    left: '2.5%',
    top: '2.5%',
    maxHeight: '60%',
    position: 'absolute',
    overflowY: 'scroll',
    animationDuration: '1s',
    animationName: 'slidein',
  },
  paper: {
    width: '95%',
  },
  heading: {
    textAlign: 'center',
    padding: 16,
  },
  transactions: {
    padding: 16,
  },
  button: {
    color: 'white',
    top: '65%',
    borderRadius: 500,
  },
  buttonContainer: {
    height: '100%',
    textAlign: 'center',
    animationDelay: `${BUTTON_ANIM_DELAY}s`,
    animationDuration: '1s',
    animationName: 'buttonslideanim'
  } 
});

class TransactionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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
  }
  createBudget = () => {

  }
  renderTable = () => {
    const { classes, transactions } = this.props;
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((a, b) => (a + b), 0);

    return (
      <Paper className={classes.paper} elevation={4}>
        <Typography className={classes.heading} variant="title" component="h3">
          You've spent <b>${total.toFixed(2)}</b> this month!
        </Typography>
        <Divider />
        <div className={classes.transactions}>
          {transactions.map(t => (
            <Typography key={t.transaction_id} component="p">{t.name.toUpperCase().substr(0, 16)}: <b>${t.amount.toFixed(2)}</b></Typography>
          ))}
          {transactions.map(t => (
            <Typography key={t.transaction_id} component="p">{t.name.toUpperCase().substr(0, 16)}: <b>${t.amount.toFixed(2)}</b></Typography>
          ))}
        </div>
      </Paper>
    );
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {!(this.state.loading) &&
        [<div className={classes.tableContainer}>
         {this.renderTable()}
        </div>,
        <AnimatedButton onClick={this.createBudget} animationDelay={BUTTON_ANIM_DELAY} className={classes.buttonContainer} label={'Create a budget'} />]}
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
