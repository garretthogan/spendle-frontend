import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import {bindActionCreators} from 'redux';
import {onTransactionsLoaded} from '../actions';
import { connect } from 'react-redux';
import { getTransactions } from '../api/plaid';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: '2.5%',
    left: '5%',
    width: '90%',
    animationDuration: '1s',
    animationName: 'slidein',
    overflowY: 'scroll',
    maxHeight: '60%',
  },
  paper: {
    padding: 16,
  },
  heading: {
    textAlign: 'center',
    paddingBottom: 16,
  },
  transactions: {
    paddingTop: 16,
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
        </div>
      </Paper>      
    );
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        {!(this.state.loading) &&
        <div className={classes.root}>
         {this.renderTable()}
        </div>}
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
