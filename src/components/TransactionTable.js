import React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';

const styles = theme => ({
  root: theme.mixins.gutters({
    height: '100%',
    padding: 16,
  }),
  paper: {
    padding: 16,
    overflowY: 'scroll',
    height: '90%',
  },
  heading: {
    textAlign: 'center',
    paddingBottom: 16,
  },
  transactions: {
    paddingTop: 16,
  }
});

function PaperSheet(props) {
  const { classes, transactions } = props;
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((a, b) => (a + b), 0);
  return (
    <div className={classes.root}>
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
    </div>
  );
}

export default withStyles(styles)(PaperSheet);
