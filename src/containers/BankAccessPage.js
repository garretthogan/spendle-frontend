import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import { getPublicKey, getAccessToken } from '../api/plaid';
import { withStyles } from 'material-ui/styles';
import {plaidEnv} from '../config';
import {
  onAccessTokenLoaded,
  onTransactionsLoaded
} from '../actions';
import { connect } from 'react-redux';

const styles = theme => ({
  buttonContainer: {
    height: '100%',
    textAlign: 'center',
  }  
});

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
    getAccessToken(token).then(({access_token}) => {
      this.props.history.push(`/transactions/${access_token}`);
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
      <Slide
        in={!this.state.loading && !this.state.fadeOut}
        exit={this.state.fadeOut}
        direction="right"
        timeout={{
          enter: 1000,
          exit: 1000
        }}
      >
        <div className={classes.buttonContainer}>
          <Button onClick={this.openBankSelector}>
            Connect a bank account
          </Button>
        </div>
      </Slide>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.accessToken,
});

const mapDispatchProps = (dispatch) => ({
  actions: bindActionCreators({
    onAccessTokenLoaded,
    onTransactionsLoaded
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchProps)(withStyles(styles)(BankAccessPage));
