import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Router, Scene, Tabs, Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import Home from './src/screens/Home';
import Done from './src/screens/Done';
import NotDone from './src/screens/NotDone';
import MenuModal from './src/modals/MenuModal';
import InitialLoading from './src/screens/InitialLoading';
import UserConfigs from './src/screens/UserConfigs';
import AboutApp from './src/screens/AboutApp';
import ThemeChange from './src/screens/ThemeChange';
import LanguageChange from './src/screens/LanguageChange';

const UserConfigButton = props => {
  const styles = StyleSheet.create({
    container: {
      marginRight: 20,
      height: 20,
      width: 20,
      borderRadius: 50,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => menuModal.setModalVisible()}>
        <FontAwesome5 name='ellipsis-v'
          color={props.iconColor}
          size={20} />

        <MenuModal ref={e => menuModal = e} />
      </TouchableOpacity>
    </View>
  );
}

const BackButton = color => {
  return (
    <View style={{ marginLeft: 15 }}>
      <TouchableOpacity onPress={() => Actions.pop()}>
        <FontAwesome5 name='arrow-left'
          color={color}
          size={20} />
      </TouchableOpacity>
    </View>
  );
}

class Routes extends React.Component {
  render() {
    const { 
      language,
      initialLoading, 
      screensBackgroundColor, 
      titlesAndIconsColor, 
      headerBackgroundColor 
    } = this.props;

    return (
      <Router sceneStyle={{ backgroundColor:  screensBackgroundColor }}>
        <Scene key='root'
          title='MyTasks'
          titleStyle={{
            fontWeight: 'bold',
            color: titlesAndIconsColor,
          }}
          navigationBarStyle={{
            elevation: 0,
            backgroundColor: headerBackgroundColor,
          }} >
            <Tabs tabBarPosition='top'
              headerMode='none'
              activeTintColor='#47d145'
              inactiveTintColor={titlesAndIconsColor}
              labelStyle={{
                fontWeight: 'bold',
              }}
              indicatorStyle={{
                backgroundColor: '#47d145',
              }}
              tabBarStyle={{
                backgroundColor: headerBackgroundColor,
              }}
              renderRightButton={<UserConfigButton iconColor={titlesAndIconsColor} />} >
              <Scene key='home'
                title={language === 'P' ? 'Tarefas' : 'Tasks'}
                component={Home}
                initial={!initialLoading} />
              
              <Scene key='done'
                title={language === 'P' ? 'Feitas' : 'Done'}
                component={Done} />
  
              <Scene key='notdone'
                title={language === 'P' ? 'Não Feitas' : 'Not Done'}
                component={NotDone} />
            </Tabs>
            
            <Scene key='initialloading'
              hideNavBar
              component={InitialLoading}
              initial={initialLoading} />

            <Scene key='userconfigs'
              title='Configurações'
              component={UserConfigs}
              renderBackButton={() => BackButton(titlesAndIconsColor)} />

            <Scene key='aboutapp'
              title='Sobre'
              component={AboutApp}
              renderBackButton={() => BackButton(titlesAndIconsColor)} />
              
            <Scene key='themechange'
              hideNavBar
              component={ThemeChange} />

            <Scene key='languagechange'
              hideNavBar
              component={LanguageChange} />
        </Scene>
      </Router>
    );
  }
};

const mapStateToProps = state => {
  const { 
    language,
    initialLoading, 
    screensBackgroundColor, 
    titlesAndIconsColor, 
    headerBackgroundColor,  
  } = state;

  return {
    language,
    initialLoading,
    screensBackgroundColor,
    titlesAndIconsColor,
    headerBackgroundColor,
  };
}

export default connect(
  mapStateToProps,
)(Routes);
