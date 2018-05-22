import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Grow from 'material-ui/transitions/Grow';
import Loading from '../components/Loading';
import { getPublicKey, getAccessToken } from '../api/plaid';
import { withStyles } from 'material-ui/styles';
import {plaidEnv} from '../config';
import {
  onAccessTokenLoaded,
  onTransactionsLoaded,
  setValue
} from '../actions';
import { connect } from 'react-redux';

const styles = theme => ({
  buttonContainer: {
    overflow: 'hidden',
    position: 'absolute',
    left: '10%',
    width: '80%',
    height: '100%',
    textAlign: 'center',
  },
  welcomeText: {
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    top: '41%',
    textAlign: 'center',
  },
  welcomeHeader: {
    color: 'white',
  },
  welcomeBody: {
    color: 'white',
  }
});

/**
 * To do:
 * if the user is logged in and has an existing account
 *  - don't show the connect account CTA
 *  - route to the budget calculator page
 */

class BankAccessPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handler: null,
      loading: true,
      fadeOut: false,
    };
  }
  componentDidMount() {
    this.initPlaidHandler();
  }
  initPlaidHandler = () => {
    getPublicKey().then(({public_key}) => {
      const handler = window.Plaid.create({
        apiVersion: 'v2',
        clientName: 'Spendle',
        env: plaidEnv,
        product: ['transactions'],
        key: public_key,
        onSuccess: this.onSuccess,
        onExit: this.onExit,
      });      
      this.setState({
        handler,
        loading: false,
      });      
    });
  }
  openBankSelector = () => {
    const { handler } = this.state;
    if (handler) {
      setTimeout(() => {
        handler.open();
      }, 500);
      this.setState({
        loading: true,
        fadeOut: true,
      });
    }
  }
  onSuccess = (token, metadata) => {
    getAccessToken(token).then((res) => {
      const { access_token } = res;
      console.log({ res });
      this.props.history.push(`/goal/${access_token}`);
    });
  }
  onExit = () => {
    this.setState({
      loading: false,
      fadeOut: false,
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Loading loading={this.state.loading} />
        <Grow
          timeout={{
            enter: 1500,
            exit: 1000
          }}
          in={!this.state.loading && !this.state.fadeOut}
        >
          <div className={classes.welcomeText}>
            <Typography className={classes.welcomeHeader} variant="title">Welcome to Spendle</Typography>
            <Typography className={classes.welcomeBody} variant="subheading">Connect a bank account to begin!</Typography>
          </div>  
        </Grow>
        <Grow
          timeout={{
            enter: 1500,
            exit: 1000
          }}
          in={!this.state.loading && !this.state.fadeOut}
        >
          <div className={classes.buttonContainer}>
            <Button onClick={this.openBankSelector}>
              Connect account
            </Button>
          </div>
        </Grow>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.accessToken,
  userId: state.userId
});

const mapDispatchProps = (dispatch) => ({
  actions: bindActionCreators({
    onAccessTokenLoaded,
    onTransactionsLoaded,
    setValue
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchProps)(withStyles(styles)(BankAccessPage));
