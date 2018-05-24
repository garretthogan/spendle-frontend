import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from 'material-ui/styles';
import FacebookLogin from 'react-facebook-login';
import { setUserId, setUser } from '../actions';
import { getUser } from '../api/plaid';

const styles = () => ({
  container: {
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    top: '45%',
    width: '100%',
    textAlign: 'center',
  },
});

class LoginPage extends Component {
  onClick = () => {

  }
  onLoggedIn = (me) => {
    this.props.actions.setUserId(me.userID);
    getUser(me.userID, me.accessToken).then((user) => {
      if (user.userExists) {
        this.props.actions.setUser({ ...user, fbAccessToken: me.accessToken });
        this.props.history.push(`/goal/${user.spendleAccessToken}`);
      } else {
        this.props.actions.setUser({ fbAccessToken: me.accessToken });
        this.props.history.push('/connect_bank/');
      }
    });
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.buttonContainer}>
          <FacebookLogin
            appId="439630353141475"
            onClick={this.onClick}
            callback={(me) => { this.onLoggedIn(me); }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});
const mapDistpatchToProp = dispatch => ({
  actions: bindActionCreators({ setUserId, setUser }, dispatch),
});

export default connect(mapStateToProps, mapDistpatchToProp)(withStyles(styles)(LoginPage));
