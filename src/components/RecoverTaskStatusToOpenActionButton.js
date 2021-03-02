import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5);

class RecoverTaskStatusToOpenActionButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonIsVisible: false,

      buttonSizeAnimation: new Animated.Value(0),
      iconSizeAnimation: new Animated.Value(0),
    };
  }

  buttonAnimation() {
    const { buttonIsVisible } = this.state;
    const duration = 100;

    Animated.timing(this.state.buttonSizeAnimation, {
      toValue: buttonIsVisible ? 0 : 60,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.iconSizeAnimation, {
      toValue: buttonIsVisible ? 0 : 30,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    this.setState({
      buttonIsVisible: !buttonIsVisible,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity {...this.props}>
          <Animated.View style={[
            styles.buttonContent,
            {
              backgroundColor: this.props.systemBlue,
              width: this.state.buttonSizeAnimation,
              height: this.state.buttonSizeAnimation,
            },
          ]}>

            <AnimatedIcon name='undo-alt'
              color='#fff'
              size={this.state.iconSizeAnimation} />
          
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    
    elevation: 3,
  },

  buttonContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 50,
    elevation: 3,
  },
});

const mapStateToProps = state => {
  const { systemBlue } = state;

  return {
    systemBlue,
  };
}

export default connect(
  mapStateToProps,
  null,
  null,
  {
    forwardRef: true,
  },
)(RecoverTaskStatusToOpenActionButton);
