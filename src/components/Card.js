import React from 'react';
import moment from 'moment';
import { TouchableOpacity, View, Text, Dimensions, Animated, Easing, StyleSheet, TouchableHighlight, Vibration } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as actions } from '../redux/actions';
import ConfirmationModal from '../modals/ConfirmationModal';
import TaskService from '../database/services/TaskService';

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 15;

const AnimatedFontAwesome5Icon = Animated.createAnimatedComponent(FontAwesome5);

const TitledActionButton = props => {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

      backgroundColor: props.backgroundColor,
      borderRadius: 5,
    },

    icon: {
      position: 'absolute',
    },

    title: {
      fontWeight: 'bold',
      opacity: 0.8,
    },
  });

  return (
    <TouchableOpacity {...props}>
      <Animated.View style={[
        styles.container,
        { 
          paddingHorizontal: props.paddingHorizontal || 20,
          paddingVertical: props.paddingVertical || 9,
        },
      ]}>
        <AnimatedFontAwesome5Icon name={props.iconName}
          color={props.iconColor}
          size={props.iconSize || 40}
          style={styles.icon} />

        <Animated.Text style={[
          styles.title,
          { fontSize: props.fontSize || 14 },
        ]}>
          {props.title}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  ); 
};

const IconActionButton = props => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: props.backgroundColor,
      borderRadius: 5,
    },
  });

  return (
    <TouchableOpacity {...props}>
      <Animated.View style={[
        styles.container, 
        { 
          paddingVertical: props.paddingVertical || 5,
          paddingHorizontal: props.paddingHorizontal || 5, 
        },
        ]}>
        <AnimatedFontAwesome5Icon name={props.iconName}
          color='#000'
          size={props.size || 25} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const ActionBar = props => {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      width: cardWidth,
      marginTop: 5,
      marginBottom: 5,
    },
  });

  return (
    <View style={styles.container}>
      <TitledActionButton title={props.language === 'P' ? 'Feito' : 'Done'}
        backgroundColor='#47d145'
        iconName='check'
        iconColor='lightgreen'
        iconSize={props.titledButtonIconSize}
        fontSize={props.titledButtonFontSize}
        paddingVertical={props.titledButtonPaddingVertical}
        paddingHorizontal={props.titledButtonPaddingHorizontal} 
        onPress={props.onPressDone} />

      <TitledActionButton title={props.language === 'P' ? 'Não feito' : 'Not Done'}
        backgroundColor='#e83838'
        iconName='times'
        iconColor='#ff6666'
        iconSize={props.titledButtonIconSize}
        fontSize={props.titledButtonFontSize}
        paddingVertical={props.titledButtonPaddingVertical}
        paddingHorizontal={props.titledButtonPaddingHorizontal} 
        onPress={props.onPressNotDone} />

      <IconActionButton iconName='clone'
        backgroundColor='#3a8cf0'
        size={props.iconSize}
        paddingVertical={props.paddingVertical}
        paddingHorizontal={props.cloneIconPadding}
        onPress={props.onPressClone} />

      <IconActionButton iconName='edit'
        backgroundColor='#47d145'
        size={props.iconSize}
        paddingVertical={props.paddingVertical}
        paddingHorizontal={props.editIconPadding}
        onPress={props.onPressEdit} />

      <IconActionButton iconName='trash-alt'
        backgroundColor='#ff6666'
        size={props.iconSize}
        paddingVertical={props.paddingVertical}
        paddingHorizontal={props.trashIconPadding}
        onPress={props.onPressDelete} />
    </View>
  );
}

const SelectedIndicator = props => {
  const { selected } = props;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      elevation: 2,
      
      width: '100%',
      height: '100%',
    },
    
    backgroundView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',

      width: '100%',
      height: '100%',
      
      backgroundColor: 'rgba(15, 146, 217,  .3)',
    },
  });

  if (selected) {
    return (
      <TouchableOpacity {...props} 
        style={styles.container}>
        <View style={styles.backgroundView} />
      </TouchableOpacity>
    );
  }

  return null;
}

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cardOpened: false,

      numberOfLinesAnimation: new Animated.Value(1),
      titledButtonIconSizeAnimation: new Animated.Value(0),
      titledButtonFontSizeAnimation: new Animated.Value(0),
      titledButtonPaddingVAnimation: new Animated.Value(0),
      titledButtonPaddingHAnimation: new Animated.Value(0),
      actionButtonIconPaddingVAnimation: new Animated.Value(0),
      actionButtonIconSizeAnimation: new Animated.Value(0),
      actionButtonCloneIconPaddingHAnimation: new Animated.Value(0),
      actionButtonEditIconPaddingHAnimation: new Animated.Value(0),
      actionButtonTrashIconPaddingHAnimation: new Animated.Value(0),
    };
  }

  cardAnimation() {
    if (this.props.annotation) {
      Animated.timing(this.state.numberOfLinesAnimation, {
        toValue: !this.state.cardOpened ? 30 : 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      this.actionBarAnimation();
    } else {
      this.actionBarAnimation();
    }
  }

  actionBarAnimation() {
    const duration = 200;

    Animated.timing(this.state.actionButtonIconSizeAnimation, {
      toValue: !this.state.cardOpened ? 25 : 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.actionButtonIconPaddingVAnimation, {
      toValue: !this.state.cardOpened ? 5 : 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.titledButtonIconSizeAnimation, {
      toValue: !this.state.cardOpened ? 40 : 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.titledButtonFontSizeAnimation, {
      toValue: !this.state.cardOpened ? 14 : 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.titledButtonPaddingVAnimation, {
      toValue: !this.state.cardOpened ? 9 : 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.titledButtonPaddingHAnimation, {
      toValue: !this.state.cardOpened ? 20 : 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.actionButtonCloneIconPaddingHAnimation, {
      toValue: !this.state.cardOpened ? 7 : 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.actionButtonEditIconPaddingHAnimation, {
      toValue: !this.state.cardOpened ? 5 : 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.actionButtonTrashIconPaddingHAnimation, {
      toValue: !this.state.cardOpened ? 8 : 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    this.setState({
      cardOpened: !this.state.cardOpened,
    });
  }

  changeTaskFavoriteStatus() {
    const taskService = new TaskService();

    const favorite = this.props.favorite === 'N' ? 'Y' : 'N';

    taskService.changeTaskFavoriteStatus(this.props.databaseConnection, this.props.id, 
      favorite, () => this.fetchTasks());
  }

  onPressDone() {
    this.actionBarAnimation();

    const taskService = new TaskService();
    taskService.markTaskAsDone(this.props.databaseConnection, this.props.id, () => this.fetchTasks());

    if (this.props.onPressDone) {
      this.props.onPressDone();
    }
  }
  
  onPressNotDone() {
    this.actionBarAnimation();

    const taskService = new TaskService();
    taskService.markTaskAsNotDone(this.props.databaseConnection, this.props.id, () => this.fetchTasks());
    
    if (this.props.onPressNotDone) {
      this.props.onPressNotDone();
    }
  }
  
  onPressClone() {
    this.actionBarAnimation();

    if (this.props.onConfirmClone) {
      this.confirmCloneModal.setModalVisible();
    }
  }
  
  onPressEdit() {
    this.actionBarAnimation();
    
    if (this.props.onPressEdit) {
      this.props.onPressEdit();
    }
  }
  
  onPressDelete() {
    this.actionBarAnimation();

    this.confirmInactivateModal.setModalVisible();

    if (this.props.onPressDelete) {
      this.props.onPressDelete();
    }
  }

  fetchTasks() {
    const { setTasks, setTasksDone, setTasksNotDone, databaseConnection } = this.props;
    const taskService = new TaskService();

    taskService.getAllTasks(databaseConnection, 'O', tasks => {
      if (tasks.status) {
        setTasks(tasks.data);
      } else {
        console.log('ERRORRRRRRRRR');
      }
    });

    taskService.getAllTasks(databaseConnection, 'D', tasks => {
      if (tasks.status) {
        setTasksDone(tasks.data);
      } else {
        console.log('ERRORRRRRRRRR');
      }
    });
    
    taskService.getAllTasks(databaseConnection, 'N', tasks => {
      if (tasks.status) {
        setTasksNotDone(tasks.data);
      } else {
        console.log('ERRORRRRRRRRR');
      }
    });
  }

  onSelect() {
    if (!this.props.multiSelect) {
      Vibration.vibrate(100);
    }
    
    if (this.props.onSelect) {
      this.props.onSelect();
    }
  }
  
  onDeselect() {
    if (this.props.onDeselect) {
      this.props.onDeselect();
    }
  }

  render() {
    const { status, selected, multiSelect } = this.props;

    const cardStyle = {
      backgroundColor: this.props.color,
      marginBottom: status !== 'O' ? 5 : 0,
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.card, cardStyle]}
          delayPressIn={0} 
          delayPressOut={0}
          onPress={() => {
            if (!selected && !multiSelect) {
              this.cardAnimation();
            }

            if (multiSelect) {
              this.onSelect();
            }
          }}
          onLongPress={() => this.onSelect()} >
          
          {status !== 'O' &&
            <View style={styles.finishedTask}>
              <FontAwesome name={status === 'D' ? 'check' : 'times'}
                color='#fff'
                size={70} />
            </View>
          }

          <View>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>
          
          <Text style={styles.id}>#{this.props.id}</Text>

          {status === 'O'&&
            <TouchableOpacity style={styles.heartIcon}
              onPress={() => {
                this.changeTaskFavoriteStatus();

                if (this.props.onPressFavoriteButton) {
                  this.props.onPressFavoriteButton();
                }
              }}>
              <FontAwesome name={this.props.favorite === 'Y' ? 'heart' : 'heart-o'} 
                color='red' 
                size={25} />
            </TouchableOpacity>
          }
  
          <View style={styles.dateAlarmView}>
            <Text style={styles.dateTime}>{this.props.date} {this.props.hour}</Text>

            {/* {status === 'O' &&
              <FontAwesome5 name={this.props.alarm === 'Y' ? 'volume-up' : 'volume-mute'}
                color='#000'
                size={20}
                style={{ opacity: this.props.alarm === 'Y' ? 1 : 0.5, marginLeft: 10 }} />
            } */}
          </View>

          {this.props.workingTime ?
            <View style={styles.workingTimeView}>
              <FontAwesome5 name='stopwatch'
                color='#000'
                size={20}
                style={{ marginRight: 10 }} />

              <Text style={styles.workingTime}>
                {moment().startOf('day').seconds(this.props.workingTime).format('HH:mm:ss')}
              </Text>
            </View>
          : null}
          
          {this.props.annotation ?
            <View style={styles.divisionLine} />
          : null}
            
          <View style={styles.annotationView}>
            <Animated.Text numberOfLines={this.state.numberOfLinesAnimation}
              ellipsizeMode='tail' >
              {this.props.annotation}
            </Animated.Text>
          </View>
  
        </TouchableOpacity>
        
        {status === 'O' &&
          <ActionBar language={this.props.language} 
            titledButtonIconSize={this.state.titledButtonIconSizeAnimation}
            titledButtonFontSize={this.state.titledButtonFontSizeAnimation}
            titledButtonPaddingVertical={this.state.titledButtonPaddingVAnimation}
            titledButtonPaddingHorizontal={this.state.titledButtonPaddingHAnimation}
            paddingVertical={this.state.actionButtonIconPaddingVAnimation}
            iconSize={this.state.actionButtonIconSizeAnimation}
            cloneIconPadding={this.state.actionButtonCloneIconPaddingHAnimation}
            editIconPadding={this.state.actionButtonEditIconPaddingHAnimation}
            trashIconPadding={this.state.actionButtonTrashIconPaddingHAnimation}
            onPressDone={() => this.onPressDone()}
            
            onPressNotDone={() => this.onPressNotDone()}
            
            onPressClone={() => this.onPressClone()}
            
            onPressEdit={() => this.onPressEdit()}

            onPressDelete={() => this.onPressDelete()} />
        }

        <SelectedIndicator selected={this.props.selected}
          onPress={() => this.onDeselect()} />

        <ConfirmationModal ref={e => this.confirmCloneModal = e}
          message={
            this.props.language === 'P' ?
              `Tem certeza que deseja duplicar a tarefa #${this.props.id}?`
            :
              `Are you sure you want to duplicate the task #${this.props.id}?`
          }
          onConfirm={() => {
            if (this.props.onConfirmClone) {
              this.props.onConfirmClone();
            } 
          }} />

        <ConfirmationModal ref={e => this.confirmInactivateModal = e}
          message={
            this.props.language === 'P' ?
              `Tem certeza que deseja excluir a tarefa #${this.props.id}?`
            :
              `Are you sure you want to delete the task #${this.props.id}?`
          }
          onConfirm={() => {
            const taskService = new TaskService();
            taskService.inactivateTask(this.props.databaseConnection, this.props.id, () => this.fetchTasks());

            if (this.props.onConfirmDelete) {
              this.props.onConfirmDelete()
            }
          }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
    width: deviceWidth,
    alignItems: 'center',
  },
  
  card: {
    width: cardWidth,
    elevation: 1,
    padding: 2,
    borderRadius: 5,
    minHeight: 100,
  },

  title: {
    width: '100%',
    height: 100,

    position: 'absolute',
    top: 0,

    textAlignVertical: 'center',
    textAlign: 'center',

    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -0.5, height: -0.5 },
    textShadowRadius: 1,
  },

  finishedTask: {
    position: 'absolute',

    width: '100%',
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 2,
    opacity: 0.7,
  },

  id: {
    position: 'absolute',
    top: 3,
    left: 3,

    color: '#585858',
    fontWeight: 'bold',
    opacity: 0.7,
  },

  heartIcon: {
    position: 'absolute',
    top: 3,
    right: 3,
  },

  dateAlarmView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    position: 'absolute',
    bottom: 3,
    right: 3,
  },
  
  workingTimeView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  
    position: 'absolute',
    bottom: 4,
    left: 3,
  },

  workingTime: {
    color: '#585858',
  },

  dateTime: {
    opacity: 0.5,
  },

  annotationView: {
    padding: 5,
    paddingBottom: 25,
    marginTop: 5,
  },

  divisionLine: {
    marginTop: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    opacity: 0.2,
  },
});

const mapStateToProps = state => {
  const { 
    language,
    tasks, 
    databaseConnection,
  } = state;

  return {
    language,
    tasks,
    databaseConnection,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setTasks: bindActionCreators(actions.setTasks, dispatch),
    setTasksDone: bindActionCreators(actions.setTasksDone, dispatch),
    setTasksNotDone: bindActionCreators(actions.setTasksNotDone, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Card);
