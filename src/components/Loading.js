import React from 'react';
import Grow from 'material-ui/transitions/Grow';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  loadingContainer: {
    position: 'absolute',
    top: '45%',
    left: '42.5%'
  }  
});

const Loading = ({classes, loading}) => (
  <Grow
    in={loading}
    exit={!loading}
    timeout={{
      enter: 1000,
      leave: 1000
    }}
  >
    <div className={classes.loadingContainer}>
      <div className="lds-ring">
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  </Grow>
);

export default withStyles(styles)(Loading);
