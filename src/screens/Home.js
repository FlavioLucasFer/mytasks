import React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

import { actionCreators as actions } from '../redux/actions';
import Card from '../components/Card';
import TaskRegistrationModal from '../modals/TaskRegistrationModal';
import TaskService from '../database/services/TaskService';
import HomeActionButtonsLine from '../components/HomeActionButtonsLine';
import TaskTimeCounterBar from '../components/TaskTimeCounterBar';
import ConfirmationModal from '../modals/ConfirmationModal';

const EmptyTasksMessage = props => {
  const { messageColor, language } = props;
  
  const styles = StyleSheet.create({
    message: {
      color: messageColor,
      fontWeight: 'bold',
    },
  });

  let message = 'Pressione o botão "+" (mais) para adicionar uma tarefa!';

  if (language === 'E') {
    message = 'Press the "+" (plus) button to add a task!'
  }

  return (
    <View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTasks: [],
    };
  }

  fetchTasks() {
    const { setTasks, databaseConnection } = this.props;
    const taskService = new TaskService();

    taskService.getAllTasks(databaseConnection, 'O', tasks => {
      if (tasks.status) {
        setTasks(tasks.data);
      } else {
        console.log('ERRORRRRRRRRR');
      }
    });
  }

  onConfirmClone(task) {
    const taskService = new TaskService();
    taskService.cloneTask(this.props.databaseConnection, task, () => this.fetchTasks());
  }

  onSelect(task) {
    const { selectedTasks } = this.state;

    selectedTasks.push(task);

    this.setState({
      selectedTasks,
    }, () => {
      if (this.state.selectedTasks.length === 1) {
        this.actionButtonsLine.buttonsAnimation();
      }
    });
  }
  
  onDeselect(task) {
    const { selectedTasks } = this.state;
    
    const index = selectedTasks.indexOf(task);
    
    selectedTasks.splice(index, 1);
    
    this.setState({
      selectedTasks,
    }, () => {
      if (!this.state.selectedTasks.length) {
        this.actionButtonsLine.buttonsAnimation();
      }
    });
  }

  onStartTaskTimeCounter() {
    const { selectedTask, setSelectedTask } = this.props;

    if (selectedTask === this.state.selectedTasks[0]) {
      return this.setState({ selectedTasks: [] });
    }

    if (!isEmpty(selectedTask)) {
      this.taskTimeCounterBar.stopTaskTimeCounter();
    }

    setSelectedTask(this.state.selectedTasks[0]);
    
    this.setState({
      selectedTasks: [],
    }, () => {
      this.taskTimeCounterBar.show();
    });
  }

  deleteSelectedTasks() {
    const { selectedTasks } = this.state;
    const { databaseConnection } = this.props;

    const taskService = new TaskService();

    selectedTasks.forEach((e, index) => {
      taskService.inactivateTask(databaseConnection, e.id, () => {
        if (selectedTasks.length - 1 === index) {
          this.fetchTasks();
        }
      });
    });

    this.setState({ selectedTasks: [] });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[
            styles.flatListView,
            { paddingBottom: !isEmpty(this.props.selectedTask) ? 100 : 15 },
          ]}>
          <FlatList data={this.props.tasks}
            renderItem={({ item }) => (
              <Card key={item.id} 
                id={item.id}
                title={item.title}
                date={item.date}
                hour={item.hour}
                annotation={item.annotation}
                color={item.color}
                alarm={item.alarm}
                favorite={item.favorite}
                workingTime={item.working_time}
                status={item.status}
                selected={this.state.selectedTasks.indexOf(item) > -1}
                multiSelect={this.state.selectedTasks.length}
                onPressEdit={() => this.taskRegistrationModal.setModalVisible(item)}
                onConfirmClone={() => this.onConfirmClone(item)}
                onSelect={() => this.onSelect(item)}
                onDeselect={() => this.onDeselect(item)} />
            )}
            ListEmptyComponent={
              <EmptyTasksMessage language={this.props.language}
                messageColor={this.props.titlesAndIconsColor} />
            } /> 
        </View>
          
        <TaskTimeCounterBar ref={e => this.taskTimeCounterBar = e}
          afterSetNewWorkingTime={() => this.fetchTasks()} />

        <HomeActionButtonsLine ref={e => this.actionButtonsLine = e} 
          multiSelect={this.state.selectedTasks.length > 1}
          onStartTaskTimeCounter={() => this.onStartTaskTimeCounter()}
          onPressDelete={() => this.confirmDeleteTasksModal.setModalVisible()} />

        <TaskRegistrationModal ref={e => this.taskRegistrationModal = e} />

        <ConfirmationModal ref={e => this.confirmDeleteTasksModal = e}
          message={
            this.props.language === 'P' ?
              'Tem certeza que deseja excluir as tarefas selecionadas?'
              :
              'Are you sure you want to delete the selected tasks?'
          }
          onConfirm={() => this.deleteSelectedTasks()} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },

  flatListView: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    height: '100%',
  },
});

const mapStateToProps = state => {
  const { tasks, selectedTask, databaseConnection, titlesAndIconsColor, language } = state;

  return {
    databaseConnection,
    tasks,
    selectedTask,
    titlesAndIconsColor,
    language,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setTasks: bindActionCreators(actions.setTasks, dispatch),
    setSelectedTask: bindActionCreators(actions.setSelectedTask, dispatch),
    clearSelectedTask: bindActionCreators(actions.clearSelectedTask, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
