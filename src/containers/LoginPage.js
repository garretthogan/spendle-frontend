import React, { Component } from 'react';
import { setValue, setUser } from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from 'material-ui/styles';
import FacebookLogin from 'react-facebook-login';
import { getUser } from '../api/plaid';

const styles = theme => ({
  container: {
    position: 'absolute',
    top: '50%',
    left: '25%',
  }
});

class LoginPage extends Component {
  onClick = () => {

  }
  onLoggedIn = (me) => {
    this.props.actions.setValue('userId', me.userID);
    getUser(me.userID, me.accessToken).then(user => {
      if (user.userExists) {
        this.props.actions.setUser(user);
        this.props.history.push(`/goal/${user.spendleAccessToken}`);
      } else {
        this.props.history.push('/connect_bank/');
      }
    });
  }
  render() {
    const { classes } = this.props;

    return(
      <div className={classes.container}>
        <FacebookLogin
          appId="439630353141475"
          autoLoad={true}
          onClick={this.onClick}
          callback={(me) => { this.onLoggedIn(me) }}
        />
      </div>
    );
  }
}

const mapStateToProps = () => ({});
const mapDistpatchToProp = dispatch => ({
  actions: bindActionCreators({setValue, setUser}, dispatch)
});

export default connect(mapStateToProps, mapDistpatchToProp)(withStyles(styles)(LoginPage));
