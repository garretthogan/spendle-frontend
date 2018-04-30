import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import Button from 'material-ui/Button';
import { getPublicKey, getAccessToken } from '../api/plaid';
import { withStyles } from 'material-ui/styles';
import {plaidEnv} from '../config';
import {
  onAccessTokenLoaded,
  onTransactionsLoaded
} from '../actions';
import { connect } from 'react-redux';

const styles = theme => ({
  button: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    color: 'white',
    top: '50%',
    borderRadius: 500,
  },
  buttonContainer: {
    height: '100%',
    textAlign: 'center',
  }  
})

class BankAccessPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handler: null,
      loading: true,
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
      handler.open();
      this.setState({loading: true});
    }
  }
  onSuccess = (token, metadata) => {
    getAccessToken(token).then(({access_token}) => {
      this.props.history.push(`/transactions/${access_token}`);
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.buttonContainer}>
        {!(this.state.loading) &&
        <Button className={classes.button} onClick={this.openBankSelector}>Link an account</Button>}
      </div>      
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
