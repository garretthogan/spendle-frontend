import React, {Component} from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  button: {
    color: 'white',
    top: '65%',
    borderRadius: 500,
  }
});

class AnimatedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    }
  }
  componentDidMount() {
    const delay = this.props.animationDelay * 1000;

    setTimeout(() => {
      this.setState({isVisible: true});
    }, delay);
  }
  onAnimationStart = () => {
    this.setState({
      isVisible: true,
    });
  }
  render() {
    const {onClick, label, className, classes} = this.props;

    return (
      <div className={className}>
        {this.state.isVisible && <Button className={classes.button} onClick={onClick}>{label}</Button>}
      </div>
    );
  }
}

export default withStyles(styles)(AnimatedButton);
