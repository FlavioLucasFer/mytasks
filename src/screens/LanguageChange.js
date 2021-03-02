import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as actions } from '../redux/actions';
import UserConfigsService from '../database/services/UserConfigsService';

class LanguageChange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontSizeAnimation: new Animated.Value(30),
      opacityTextAnimation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.fontSizeAnimation, {
      toValue: 50,
      duration: 500,
      delay: 800,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.opacityTextAnimation, {
      toValue: 1,
      duration: 500,
      delay: 1000,
      useNativeDriver: false,
    }).start(() => this.changeLanguage());
  }

  changeLanguage() {
    const { 
      language, 
      databaseConnection, 
      setPortugueseLanguage, 
      setEnglishLanguage 
    } = this.props;

    const userConfigsService = new UserConfigsService();

    userConfigsService.changeLanguage(databaseConnection, language);

    if (language === 'P') {
      setPortugueseLanguage();
    } else {
      setEnglishLanguage();
    }
  }

  render() {
    return (
      <Animated.View style={styles.container}>
        <Animated.Text
          color='#d6c400'
          style={[
            styles.text, 
            { 
              opacity: this.state.opacityTextAnimation, 
              fontSize: this.state.fontSizeAnimation,
              color: this.props.titlesAndIconsColor,
            }]}>
          {this.props.language === 'P' ? 'Português' : 'English'}
        </Animated.Text>
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

  text: {
    elevation: 5,
    fontWeight: 'bold',

  }
});

const mapStateToProps = state => {
  const { databaseConnection, titlesAndIconsColor } = state;

  return {
    databaseConnection,
    titlesAndIconsColor,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setPortugueseLanguage: bindActionCreators(actions.setPortugueseLanguage, dispatch),
    setEnglishLanguage: bindActionCreators(actions.setEnglishLanguage, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageChange);
