import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';

class Toastr extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setStateClean();
  }

  setStateClean() {
    return {
      message: '',
      interval: '',
      opacity: new Animated.Value(0),
    };  
  }

  fadeInAnimation() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 700,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  fadeOutAnimation() {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      this.setState(this.setStateClean());
    });
  }

  setVisible(message, intervalValue = 4000) {
    const interval = setInterval(() => {
      this.setInvisible();
    }, this.props.interval || intervalValue);

    this.setState({
      message,
      interval,
    }, () => {
      this.fadeInAnimation();
    });
  }

  setInvisible() {
    clearInterval(this.state.interval);

    this.fadeOutAnimation();
  }
  
  render() {
    return (
      <Animated.View style={[
          styles.container, 
          { 
            backgroundColor: this.props.systemBlue, 
            opacity: this.state.opacity, 
          },
        ]}>
        <TouchableOpacity onPress={() => this.setInvisible()}>
          <Text style={[styles.message, { color: '#fff' }]}>
            {this.state.message || this.props.message}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    
    alignSelf: 'center',

    elevation: 10,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  
  message: {
    // fontSize: 16,
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const { 
    systemBlue, 
    systemGrey,
  } = state;
  
  return {
    systemBlue, 
    systemGrey,
  };
}

export default connect(
  mapStateToProps,
  null,
  null,
  {
    forwardRef: true,
  },
)(Toastr);
