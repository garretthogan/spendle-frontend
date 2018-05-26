import React from 'react';
import Grow from 'material-ui/transitions/Grow';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  fieldContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  prompt: {
    fontSize: 18,
  },
  input: {
    width: '90%',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: '1px solid white',
    paddingTop: 16,
    paddingBottom: 4,
    paddingLeft: 12,
    fontSize: 18,
    '&:focus': {
      outlineWidth: 0,
    },
  },
  adornment: {
    marginRight: -10,
    display: 'inline-block',
  },
});

const InputField = ({
  classes,
  enter,
  exit,
  prompt,
  adornment,
  value,
  onChange,
  type,
}) => (
  <Grow in={enter} exit={exit} timeout={{ enter: 1500, exit: 1000 }}>
    <div className={classes.fieldContainer}>
      <div className={classes.prompt}>{prompt}</div>
      {adornment && <span className={classes.adornment}>{adornment}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={classes.input}
      />
    </div>
  </Grow>
);

export default withStyles(styles)(InputField);
