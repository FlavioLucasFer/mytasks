import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import SelectableTag from '../components/SelectableTag';

const ConfigItem = props => {
  const styles = StyleSheet.create({
    container: {
      padding: 5,
    },

    headerView: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },

    title: {
      color: props.titleAndIconColor,
      fontSize: 24,
      fontWeight: 'bold',
      marginRight: 5,
    },

    childrenView: {
      marginTop: 10,
    },
  });

  return (
    <TouchableWithoutFeedback {...props}>
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.title}>{props.title}</Text>

          <FontAwesome5 name={props.iconName}
            color={props.titleAndIconColor}
            size={props.iconSize || 20} />
        </View>

        <View style={styles.childrenView}>
          {props.children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

class UserConfigs extends React.Component {
  render() {
    const {
      language,
      theme,
      titlesAndIconsColor,
    } = this.props;
    
    return (
      <View>
        <ConfigItem title={language === 'P' ? 'Tema' : 'Theme'}
          iconName='adjust'
          titleAndIconColor={titlesAndIconsColor}>
          <View style={styles.row}>
            <View style={styles.lightThemeView}>
              <SelectableTag title={language === 'P' ? 'Claro' : 'Light'}
                selected={theme === 'L'}
                onPress={() => {
                  if (theme !== 'L') {
                    Actions.themechange({ theme: 'L' });
                  }
                }}
                unSelectedColor={titlesAndIconsColor} />
            </View>
            
            <SelectableTag title={language === 'P' ? 'Escuro' : 'Dark'}
              selected={theme === 'D'}
              onPress={() => {
                if (theme !== 'D') {
                  Actions.themechange({ theme: 'D' });
                }
              }}
              unSelectedColor={titlesAndIconsColor} />
          </View>
        </ConfigItem>

        <ConfigItem title={language === 'P' ? 'Idioma' : 'Language'}
          iconName='language'
          iconSize={24}
          titleAndIconColor={titlesAndIconsColor}>
          <View style={styles.row}>
            <View style={styles.lightThemeView}>
              <SelectableTag title='Português'
                selected={language === 'P'}
                onPress={() => {
                  if (language !== 'P') {
                    Actions.languagechange({ language: 'P' });
                  }
                }}
                unSelectedColor={titlesAndIconsColor} />
            </View>
            
            <SelectableTag title='English'
              selected={language === 'E'}
              onPress={() => {
                if (language !== 'E') {
                  Actions.languagechange({ language: 'E' });
                }
              }}
              unSelectedColor={titlesAndIconsColor} />
          </View>
        </ConfigItem>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },

  lightThemeView: {
    marginRight: 10,
  },
});

const mapStateToProps = state => {
  const { 
    language, 
    theme, 
    headerBackgroundColor, 
    titlesAndIconsColor 
  } = state;

  return {
    language,
    theme,
    headerBackgroundColor,
    titlesAndIconsColor,
  };
}

export default connect(
  mapStateToProps,
)(UserConfigs);
