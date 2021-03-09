import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RecoverTaskStatusToOpenActionButton from '../components/RecoverTaskStatusToOpenActionButton';
import { actionCreators as actions } from '../redux/actions';
import ConfirmationModal from '../modals/ConfirmationModal';
import TaskService from '../database/services/TaskService';
import Card from '../components/Card';
import Toastr from '../components/Toastr';

const EmptyTasksMessage = props => {
  const { messageColor, language } = props;

  const styles = StyleSheet.create({
    message: {
      color: messageColor,
      fontWeight: 'bold',
    },
  });

  let message = 'Nenhuma tarefa marcada como "não feita" encontrada!';

  if (language === 'E') {
    message = 'No tasks marked "not done" found!'
  }

  return (
    <View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

class NotDone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTasks: [],
    };
  }

  fetchTasks() {
    const { setTasks, setTasksNotDone, databaseConnection, language } = this.props;
    const taskService = new TaskService();

    taskService.getAllTasks(databaseConnection, 'O', tasks => {
      if (tasks.status) {
        setTasks(tasks.data);
      } else {
        let errorMessage = 'Um erro ocorreu durante a busca das tarefas abertas :(';

        if (language) {
          errorMessage = 'An error occurred while searching for open tasks';
        }

        this.toastr.setVisible(errorMessage);
      }
    });

    taskService.getAllTasks(databaseConnection, 'D', tasks => {
      if (tasks.status) {
        setTasksNotDone(tasks.data);
      } else {
        let errorMessage = 'Um erro ocorreu durante a busca das tarefas não feitas :(';

        if (language) {
          errorMessage = 'An error occurred while searching for tasks not done';
        }

        this.toastr.setVisible(errorMessage);
      }
    });
  }

  onSelect(task) {
    const { selectedTasks } = this.state;

    selectedTasks.push(task);

    this.setState({
      selectedTasks,
    }, () => {
      if (this.state.selectedTasks.length === 1) {
        this.recoverTaskStatusToOpenActionButton.buttonAnimation();
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
        this.recoverTaskStatusToOpenActionButton.buttonAnimation();
      }
    });
  }

  reopenTasks() {
    const { selectedTasks } = this.state;
    const { databaseConnection } = this.props;

    const taskService = new TaskService();

    selectedTasks.forEach((e, index) => {
      taskService.markTaskAsOpen(databaseConnection, e.id, () => {
        if (selectedTasks.length - 1 === index) {
          this.fetchTasks();
        }
      });
    });

    this.setState({ 
      selectedTasks: [],
    }, () => {
      this.recoverTaskStatusToOpenActionButton.buttonAnimation();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.props.tasksNotDone}
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
              multiSelect={this.state.selectedTasks.length}
              selected={this.state.selectedTasks.indexOf(item) > -1}
              onSelect={() => this.onSelect(item)}
              onDeselect={() => this.onDeselect(item)} />
          )}
          ListEmptyComponent={
            <EmptyTasksMessage language={this.props.language}
              messageColor={this.props.titlesAndIconsColor} />
          } />
      
        <RecoverTaskStatusToOpenActionButton ref={e => this.recoverTaskStatusToOpenActionButton = e}
          onPress={() => this.confirmReopenTasksModal.setModalVisible()} />

        <ConfirmationModal ref={e => this.confirmReopenTasksModal = e}
          message={
            this.props.language === 'P' ?
              'Tem certeza que deseja reabrir as tarefas selecionadas?'
              :
              'Are you sure you want to reopen the selected tasks?'
          }
          onConfirm={() => this.reopenTasks()} />

        <Toastr ref={e => this.toastr = e} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    height: '100%',
  },
});

const mapStateToProps = state => {
  const { tasksNotDone, databaseConnection, titlesAndIconsColor, language } = state;

  return {
    tasksNotDone,
    databaseConnection,
    titlesAndIconsColor, 
    language,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setTasks: bindActionCreators(actions.setTasks, dispatch),
    setTasksNotDone: bindActionCreators(actions.setTasksNotDone, dispatch),
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotDone);
