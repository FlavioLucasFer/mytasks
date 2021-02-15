import React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import Card from '../components/Card';
import TaskRegistrationModal from '../modals/TaskRegistrationModal';
import Database from '../database/Database';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      database: new Database('my-tasks-db'),
    };
  }

  componentDidMount() {
    this.state.database.initDb();

    this.getAllTasks();
  }

  getAllTasks() {
    const databaseConnection = this.state.database.getDatabaseConnection();

    const getAllTasksSql = `
      SELECT id 
        ,title
        ,annotation
        ,date
        ,hour
        ,color
        ,alarm
        ,favorite
      FROM task
      WHERE status = 'O' 
        AND deleted = 'N'
      ORDER BY favorite = 'Y' 
        AND id DESC;
    `;
    
    databaseConnection.transaction(tx => {
      tx.executeSql(getAllTasksSql, [], (e, i) => {
        console.log(`[SELECT OF ALL TASKS WAS SUCCESS]`);

        const tasks = [];
        
        console.log('sele:', i);

        for (let index = 0; index < i.rows.length; index++) {
          tasks.push(i.rows.item(index));
        }

        this.setState({
          tasks,
        });
      });
    });
  }
  
  changeTaskFavoriteStatus(id, favorite) {
    const databaseConnection = this.state.database.getDatabaseConnection();
  
    const sqlTaskFavoriteStatus = `
      UPDATE task SET
        favorite = '${favorite}' 
      WHERE id = ${id};
    `;

    databaseConnection.transaction(tx => {
      tx.executeSql(sqlTaskFavoriteStatus, [], (e, i) => {
        console.log('[UPDATE TASK FAVORITE STATUS SUCCESS]');

        const { tasks } = this.state;

        const index = tasks.findIndex(e => e.id === id);

        tasks[index].favorite = favorite;

        this.setState({
          tasks,
        });
      });
    });

  }

  render() {
    return (
      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
        height: '100%',
      }}>
        <FlatList data={this.state.tasks}
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
              onPressFavoriteButton={(id, favorite) => {
                this.changeTaskFavoriteStatus(id, favorite);
              }} />
          )} /> 

        <TouchableOpacity style={styles.newTaskButton}
          onPress={() => {
            this.taskRegistrationModal.setModalVisible();
          }}>
          <FontAwesome5 name='plus'
            color='#fff'
            size={30} />
        </TouchableOpacity>

        <TaskRegistrationModal ref={e => this.taskRegistrationModal = e}
          onConfirm={task => {
            const { tasks } = Object.assign({}, this.state); 
            
            tasks.unshift(task);

            this.setState({
              tasks,
            });
          }}
          databaseConnection={this.state.database.getDatabaseConnection()} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  newTaskButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 

    position: 'absolute',
    bottom: 20,
    right: 10,

    backgroundColor: '#47d145',
    borderRadius: 50,
    height: 60,
    width: 60,
  },
});

export default Home;
