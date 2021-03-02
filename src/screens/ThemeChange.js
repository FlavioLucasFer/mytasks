import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as actions } from '../redux/actions';
import UserConfigsService from '../database/services/UserConfigsService';

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5);

class ThemeChange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundAnimation: new Animated.Value(0),
      iconSizeAnimation: new Animated.Value(50),
      opacityIconAnimation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.backgroundAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.iconSizeAnimation, {
      toValue: 80,
      duration: 500,
      delay: 1300,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.opacityIconAnimation, {
      toValue: 1,
      duration: 500,
      delay: 1300,
      useNativeDriver: false,
    }).start(() => this.changeTheme());
  }

  changeTheme() {
    const { theme, databaseConnection, setLightTheme, setDarkTheme } = this.props;

    const userConfigsService = new UserConfigsService();

    userConfigsService.changeTheme(databaseConnection, theme);

    if (theme === 'D') {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  }

  interpolateBackgrouncolorAnimation() {
    if (this.props.theme === 'D') {
      return this.state.backgroundAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#f7f7f7', '#585858'],
      });
    }
    
    return this.state.backgroundAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['#585858', '#f7f7f7'],
    });
  }

  render() {
    return (
      <Animated.View style={[styles.container, { backgroundColor: this.interpolateBackgrouncolorAnimation() }]}>
        <AnimatedIcon name={this.props.theme === 'D' ? 'moon' : 'sun'}
          color='#d6c400'
          size={this.state.iconSizeAnimation}
          style={[styles.icon, { opacity: this.state.opacityIconAnimation }]} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: '100%',
  },

  icon: {
    elevation: 5,
  }
});

const mapStateToProps = state => {
  const { databaseConnection } = state;

  return {
    databaseConnection,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setLightTheme: bindActionCreators(actions.setLightTheme, dispatch),
    setDarkTheme: bindActionCreators(actions.setDarkTheme, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThemeChange);
