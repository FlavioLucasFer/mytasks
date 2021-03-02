import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TaskService from '../database/services/TaskService';
import UserConfigsService from '../database/services/UserConfigsService';

import { actionCreators as actions } from '../redux/actions'

class InitialLoading extends React.Component {
  componentDidMount() {
    this.initApp();
  }
  
  fetchTheme(callback) {
    const { databaseConnection, setDarkTheme } = this.props;
  
    const userConfigsService = new UserConfigsService();
  
    let theme = '';
  
    userConfigsService.getTheme(databaseConnection, e => {
      if (e.status) {
        theme = e.data;
      }
  
      if (!theme) {
        userConfigsService.insertTheme(databaseConnection);
        theme = 'L';
      }
  
      if (theme === 'D') {
        setDarkTheme();
      }

      if (callback) {
        callback();
      }
    });
  }

  fetchLanguage(callback) {
    const { databaseConnection, setEnglishLanguage } = this.props;
  
    const userConfigsService = new UserConfigsService();
  
    let language = '';
  
    userConfigsService.getLanguage(databaseConnection, e => {
      if (e.status) {
        language = e.data;
      }
  
      if (!language) {
        userConfigsService.insertLanguage(databaseConnection);
        language = 'P';
      }
  
      if (language === 'E') {
        setEnglishLanguage();
      }

      if (callback) {
        callback();
      }
    });
  }

  fetchTasks(callback) {
    const { setTasks, databaseConnection } = this.props;
    const taskService = new TaskService();

    taskService.getAllTasks(databaseConnection, 'O', tasks => {
      if (tasks.status) {
        setTasks(tasks.data);
      } else {
        console.log('ERRORRRRRRRRR');
      }

      if (callback) {
        callback();
      }
    });
  }

  fetchTasksDone(callback) {
    const { setTasksDone, databaseConnection } = this.props;
    const taskService = new TaskService();

    taskService.getAllTasks(databaseConnection, 'D', tasks => {
      if (tasks.status) {
        setTasksDone(tasks.data);
      } else {
        console.log('ERRORRRRRRRRR');
      }

      if (callback) {
        callback();
      }
    });
  }

  fecthTasksNotDone(callback) {
    const { setTasksNotDone, databaseConnection } = this.props;
    const taskService = new TaskService();

    taskService.getAllTasks(databaseConnection, 'N', tasks => {
      if (tasks.status) {
        setTasksNotDone(tasks.data);
      } else {
        console.log('ERRORRRRRRRRR');
      }

      if (callback) {
        callback();
      }
      
    });
  }
  
  initApp() {
    const { setInitialLoadingToFalse } = this.props;

    this.fetchLanguage(() => {
      this.fetchTheme(() => {
        this.fetchTasks(() => {
          this.fetchTasksDone(() => {
            this.fecthTasksNotDone(() => {
              setInitialLoadingToFalse();
            });
          });
        });
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoView}>
          <Image source={require('../images/logo.png')}
            style={styles.logo} />
        </View>

        <View style={styles.versionView}>
          <Text style={styles.version}>Beta 1.0</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logoView: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  
  logo: {
    width: 100,
    height: 100,
  },
  
  versionView: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  version: {
    color: '#585858',
  },
});

const mapStateToProps = state => {
  const { databaseConnection } = state;

  return {
    databaseConnection,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setInitialLoadingToFalse: bindActionCreators(actions.setInitialLoadingToFalse, dispatch),
    setTasks: bindActionCreators(actions.setTasks, dispatch),
    setTasksDone: bindActionCreators(actions.setTasksDone, dispatch),
    setTasksNotDone: bindActionCreators(actions.setTasksNotDone, dispatch),
    setDarkTheme: bindActionCreators(actions.setDarkTheme, dispatch),
    setEnglishLanguage: bindActionCreators(actions.setEnglishLanguage, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InitialLoading);
