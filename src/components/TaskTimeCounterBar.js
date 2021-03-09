import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing, Text, AppState } from 'react-native';
import moment from 'moment';
import { FontAwesome5 } from '@expo/vector-icons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as actions } from '../redux/actions';
import TaskService from '../database/services/TaskService';
import { isEmpty } from 'lodash';

class TaskTimeCounterBar extends React.Component {
  tick = null;

  constructor(props) {
    super(props);

    this.state = {
      bottomAnimation: new Animated.Value(-80),
      appState: AppState.currentState,
      backgroundedAppTimestamp: '',
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      const { selectedTask, setMoreSecondsToTaskTimeCounter } = this.props;

      if (!isEmpty(selectedTask)) {
        const { backgroundedAppTimestamp } = this.state;
        
        const now = moment(new Date());
        const start = moment(backgroundedAppTimestamp);
        const secondsDiff = moment.duration(now.diff(start)).asSeconds();

        setMoreSecondsToTaskTimeCounter(secondsDiff);

        this.setState({ backgroundedAppTimestamp: '' });
      }
      
    } 
    
    else {
      this.setState({ backgroundedAppTimestamp: new Date() });
    }

    this.setState({ appState: nextAppState });
  };

  show() {
    Animated.timing(this.state.bottomAnimation, {
      toValue: 0,
      duration: 200,
      delay: 400,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    this.startTaskTimeCounter();
  }
  
  close() {
    Animated.timing(this.state.bottomAnimation, {
      toValue: -80,
      duration: 200,
      delay: 400,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      this.stopTaskTimeCounter();
    });
  }

  startTaskTimeCounter() {
    const { selectedTask, increaseTaskTimeCounter } = this.props;

    if (selectedTask) {
      clearInterval(this.tick);

      this.tick = setInterval(() => {
        increaseTaskTimeCounter();
      }, 1000);
    }
  }

  stopTaskTimeCounter() {
    const { 
      selectedTask, 
      databaseConnection, 
      taskTimeCounter, 
      resetTaskTimeCounter, 
      clearSelectedTask,
      afterSetNewWorkingTime,
    } = this.props;

    if (taskTimeCounter) {
      clearInterval(this.tick);

      const newWorkingTime = selectedTask.working_time + taskTimeCounter;

      const taskService = new TaskService();

      taskService.updateWorkingTime(databaseConnection, selectedTask.id, newWorkingTime, () => {
        if (afterSetNewWorkingTime) {
          afterSetNewWorkingTime();
        }
      });

      resetTaskTimeCounter();
      clearSelectedTask();
    }
  }

  render() {
    const { selectedTask, taskTimeCounter } = this.props;

    return (
      <Animated.View style={[
          styles.container,
          { 
            bottom: this.state.bottomAnimation,
            backgroundColor: selectedTask.color, 
          }
        ]}>
        <View style={styles.stopButtonView}>
          <TouchableOpacity onPress={() => this.close()}
            style={styles.stopButton}>
            <FontAwesome5 name='stop'
              color='#fff'
              size={30} />
          </TouchableOpacity>
        </View>

        <View style={styles.descAndTaskCounterContent}>
          <Text style={styles.taskTitle}>
            {`#${selectedTask.id} - ${selectedTask.title}`}
          </Text>
          
          <Text style={styles.taskTimeCounter}>
            {moment().startOf('day').seconds(taskTimeCounter).format('HH:mm:ss')}
          </Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    
    display: 'flex',
    flexDirection: 'row',
    
    width: '100%',
    height: 80,
  },
  
  stopButtonView: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(88, 88, 88, .3)',
    padding: 10,
    paddingBottom: 20,
  },

  stopButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
    elevation: 1,
    height: '100%',
    width: 60,
  },

  descAndTaskCounterContent: {
    height: '100%',
    width: '100%',
    padding: 10,
  },

  taskTitle: {
    color: '#585858',
    fontWeight: 'bold',
  },

  taskTimeCounter: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    elevation: 1,
  },

});

const mapStateToProps = state => {
  const { selectedTask, databaseConnection, taskTimeCounter } = state;
  
  return {
    selectedTask,
    taskTimeCounter,
    databaseConnection,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    resetTaskTimeCounter: bindActionCreators(actions.resetTaskTimeCounter, dispatch),
    increaseTaskTimeCounter: bindActionCreators(actions.increaseTaskTimeCounter, dispatch),
    clearSelectedTask: bindActionCreators(actions.clearSelectedTask, dispatch),
    setMoreSecondsToTaskTimeCounter: bindActionCreators(actions.setMoreSecondsToTaskTimeCounter, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
  },
)(TaskTimeCounterBar);
