import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Grow from 'material-ui/transitions/Grow';
import { deleteUser } from '../api/plaid';

const styles = () => ({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '45%',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    padding: 6,
  },
});

class AccountManagementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
    };
  }
  deleteProfile = () => {
    const { userId, userAccessToken } = this.props;
    this.setState({
      deleting: true,
    });
    deleteUser(userId, userAccessToken).then(() => {
      this.props.history.push('/');
    });
  }
  configureBudget = () => {
    this.props.history.push('/goal/');
  }
  render() {
    const { classes } = this.props;
    const { deleting } = this.state;

    return (
      <div className={classes.container}>
        <Grow
          in={!deleting}
          exit={deleting}
          timeout={{
            enter: 1500,
            exit: 1000,
          }}
        >
          <div>
            <div className={classes.buttonContainer}>
              <Button onClick={this.deleteProfile}>Delete Account</Button>
            </div>
            <div className={classes.buttonContainer}>
              <Button onClick={this.configureBudget}>Configure Budget</Button>
            </div>
          </div>
        </Grow>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.userId,
  userAccessToken: state.userAccessToken,
});

const mapDispatchToProps = () => ({ });

const styled = withStyles(styles)(AccountManagementPage);
export default connect(mapStateToProps, mapDispatchToProps)(styled);
