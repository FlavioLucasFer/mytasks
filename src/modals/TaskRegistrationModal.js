import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Modal, View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as actions } from '../redux/actions';
import Input from '../components/Input';
import SelectableTag from '../components/SelectableTag';
import ColorBlock from '../components/ColorBlock';
import CardPreview, { BodyCardPreview, FooterCardPreview, HeaderCardPreview } from '../components/CardPreview';
import ConfirmationModal from './ConfirmationModal';
import TaskService from '../database/services/TaskService';
import Notification from '../utils/Notification';

const devideHeight = Dimensions.get('window').height;

const CardPreviewContainer = props => {
  const styles = StyleSheet.create({
    cardPreviewContainer: {
      padding: 5,
      backgroundColor: 'rgba(0, 0, 0, .1)',
      borderRadius: 5,
    },

    previewText: {
      color: props.previewTextColor || '#585858',
      fontWeight: 'bold',
    },

    previewView: {
      height: props.height || devideHeight / 10,
    },
  });

  return (
    <View style={styles.cardPreviewContainer}>
      <Text style={styles.previewText}>Preview</Text>
      <View style={styles.previewView}>
        {props.children}
      </View>
    </View>
  );
}

class TaskRegistrationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setStateClear();
  }

  setStateClear() {
    return {
      isModalVisible: false,
      actualPageNumber: 1,
      showHourPicker: false,
      showDatePicker: false,
      hourPickerValue: new Date(),
      datePickerValue: new Date(),

      id: '',
      title: '',
      annotation: '',
      dateType: 'today',
      date: moment().format('DD/MM/YYYY'),
      hour: moment().format('HH:mm'),
      alarm: 'Y',
      color: 'lightgreen',
    };
  }

  setModalVisible(task) {
    if (task) {
      this.setState({
        ...this.setStateClear(),
        isModalVisible: true,
        ...task,
        originalTask: task,
      });
    } else {
      this.setState({
        ...this.setStateClear(),
        isModalVisible: true,
      });
    }
  }

  setModalInvisible() {
    this.setState({
      isModalVisible: false,
    });
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

  renderDialogText(text) {
    return <Text style={[styles.dialogText, { color: this.props.titlesAndIconsColor }]}>{text}</Text>;
  }

  renderTitleForm() {
    const { 
      language,
      headerBackgroundColor,
      titlesAndIconsColor,
    } = this.props;

    return (
      <View style={styles.formContent}>
        {this.renderDialogText(language === 'P' ? 'Qual o título da sua tarefa?' : 'What is the title of your task?')}
        <View style={styles.titleFormView}>
          <View style={styles.titleInput}>
            <Input countCharLength
              maxLength={20}
              borderColor={titlesAndIconsColor}
              backgroundColor={headerBackgroundColor !== '#fff' && 'rgba(255, 255, 255, .2)'}
              value={this.state.title}
              onChangeText={e => {
                this.setState({
                  title: e,
                });
              }} />
          </View>
          
          <CardPreviewContainer previewTextColor={titlesAndIconsColor}>
            <HeaderCardPreview title={this.state.title}
              color={this.state.color} />
          </CardPreviewContainer>
        </View>
      </View>
    );
  }
  
  renderAnnotationForm() {
    const { 
      language,
      headerBackgroundColor,
      titlesAndIconsColor,
    } = this.props;

    return (
      <View style={styles.formContent}>
        {this.renderDialogText(language === 'P' ? 'Que tal algumas anotações?' : 'How about some notes ?')}
        <View style={styles.annotationFormView}>
          <View style={styles.annotationInput}>
            <Input countCharLength
              maxLength={135}
              borderColor={titlesAndIconsColor}
              backgroundColor={headerBackgroundColor !== '#fff' && 'rgba(255, 255, 255, .2)'}
              multiline
              value={this.state.annotation}
              onChangeText={e => {
                this.setState({
                  annotation: e,
                });
              }} />
          </View>

          <CardPreviewContainer previewTextColor={titlesAndIconsColor}>
            <BodyCardPreview annotation={this.state.annotation}
              color={this.state.color} />
          </CardPreviewContainer>
        </View>
      </View>
    );
  }

  renderDateHourPicker() {
    const { showHourPicker, showDatePicker, datePickerValue, hourPickerValue } = this.state;

    if (showHourPicker || showDatePicker) {
      return <DateTimePicker value={showHourPicker ? hourPickerValue : datePickerValue}
        mode={showHourPicker ? 'time' : 'date'}
        locale='pt-BR'
        is24Hour
        minimumDate={new Date()}
        onChange={(e, i) => {
          if (e.type === 'dismissed') {
            this.setState({
              showHourPicker: false,
              showDatePicker: false,
            });
            return; 
          }

          if (showHourPicker) {
            this.setState({
              showHourPicker: false,
              hourPickerValue: i,
              hour: moment(i).format('HH:mm'),
            });
          } else {
            this.setState({
              showDatePicker: false,
              datePickerValue: i,
              date: moment(i).format('DD/MM/YYYY'),
            });
          }
        }} />;
    }

    return;
  }
  
  renderDateHourForm() {
    const { dateType, date } = this.state;
    const { language, titlesAndIconsColor } = this.props;

    return (
      <View style={styles.formContent}>
        {this.renderDialogText(language === 'P' ? 'Essa tarefa é para quando?' : 'When is this task due?')}
        <View style={styles.dateFormView}>
          <View style={styles.tagMarginRight}>
            <SelectableTag title={language === 'P' ? 'Hoje' : 'Today'}
              selected={dateType === 'today'}
              onPress={() => this.setState({ 
                dateType: 'today',
                date: moment().format('DD/MM/YYYY'),
              })} 
              unSelectedColor={titlesAndIconsColor} />
          </View>

          <View style={styles.tagMarginRight}>
            <SelectableTag title={language === 'P' ? 'Seg. a Sex.' : 'Mon. to Fri.'}
              selected={dateType === 'mondayToFriday'}
              onPress={() => this.setState({ 
                dateType: 'mondayToFriday',
                date: 'SEG. A SEX.',
              })} 
              unSelectedColor={titlesAndIconsColor} />
          </View>

          <View style={styles.tagMarginRight}>
            <SelectableTag title={language === 'P' ? 'Todos os dias' : 'Everydays'}
              selected={dateType === 'everydays'}
              onPress={() => this.setState({ 
                dateType: 'everydays',
                date: 'TODOS OS DIAS',
              })} 
              unSelectedColor={titlesAndIconsColor} />
          </View>

          <View style={styles.tagMarginTop}>
            <SelectableTag title={`${language === 'P' ? 'Dia do mês' : 'Day of month'}${date && dateType === 'monthDay' ? ': ' + date : ''}`}
              selected={dateType === 'monthDay'}
              onPress={() => {
                this.setState({ 
                  dateType: 'monthDay',
                  showDatePicker: true,
                });
              }} 
              unSelectedColor={titlesAndIconsColor} />
          </View>
        </View>

        {this.renderDialogText(language === 'P' ? 'E o horário?' : 'And what time?')}
        <View style={styles.hourFormView}>
          <SelectableTag title={this.state.hour}
            onPress={() => this.setState({ showHourPicker: true })}
            unSelectedColor={titlesAndIconsColor} />

            {this.renderDateHourPicker()}
        </View>

        {/* {this.renderDialogText(language === 'P' ? 'Quer que eu toque pra te lembrar?' : 'Do you want me to play to remind you?')}
        <View style={styles.alarmFormView}>
          <View style={styles.tagMarginRight}>
            <SelectableTag title={language === 'P' ? 'Sim' : 'Yes'}
              selected={this.state.alarm === 'Y'}
              onPress={() => this.setState({ alarm: 'Y' })} 
              unSelectedColor={titlesAndIconsColor} />
          </View>

          <SelectableTag title={language === 'P' ? 'Não' : 'No'}
            selected={this.state.alarm === 'N'}
            onPress={() => this.setState({ alarm: 'N' })} 
            unSelectedColor={titlesAndIconsColor} />
        </View> */}

        <CardPreviewContainer height={devideHeight / 24}
          previewTextColor={titlesAndIconsColor}>
          <FooterCardPreview date={this.state.date}
            hour={this.state.hour}
            alarm={this.state.alarm === 'Y'}
            color={this.state.color} />
        </CardPreviewContainer>
      </View>
    );
    
  }
  
  renderColorForm() {
    const { color, title } = this.state;
    const { language, titlesAndIconsColor } = this.props;

    const colors = [
      'lightgreen',
      'lightblue',
      'lightgrey',
      'lightpink',
      'aquamarine',
      'aliceblue',
      'lightsalmon',
      'cadetblue',
    ];

    return (
      <View style={styles.formContent}>
        {this.renderDialogText(language === 'P' ? 'Pra finalizar, que tal uma cor?' : 'Finally, how about a color?')}
        <View style={styles.colorFormView}>
          {colors.map(e => (
              <View style={[styles.tagMarginRight, styles.tagMarginTop]}>
                <ColorBlock backgroundColor={e}
                  selected={color === e}
                  onPress={() => this.setState({ color: e })} />
              </View> 
          ))}

        </View>

        <CardPreviewContainer previewTextColor={titlesAndIconsColor}>
          <HeaderCardPreview title={title}
            color={color} />
        </CardPreviewContainer>
      </View>
    );
  }

  renderConfirmForm() {
    const styles = StyleSheet.create({
      cardPreview: {
        height: !this.state.annotation ? 80 : '100%',
      },
    });

    return (
      <View style={styles.cardPreview}>
        <CardPreview title={this.state.title}
          annotation={this.state.annotation}
          date={this.state.date}
          hour={this.state.hour}
          alarm={this.state.alarm === 'Y'}
          color={this.state.color}
          disableBody={!this.state.annotation} />
      </View>
    );
  }

  renderForm() {
    switch (this.state.actualPageNumber) {
      case 1:
        return this.renderTitleForm();
    
      case 2:
        return this.renderAnnotationForm();
      
      case 3:
        return this.renderDateHourForm();

      case 4:
        return this.renderColorForm();

      case 5:
        return this.renderConfirmForm();

      default:
        return this.renderTitleForm();
    }
  }

  nextForm() {
    let { actualPageNumber } = this.state;
  
    if (actualPageNumber < 5) {
      actualPageNumber += 1;
    }
  
    this.setState({
      actualPageNumber,
    });
  }
  
  previousForm() {
    let { actualPageNumber } = this.state;

    if (actualPageNumber > 1) {
      actualPageNumber -= 1;
    }

    this.setState({
      actualPageNumber,
    });
  }

  sendNotification(taskId) {
    const splitDate = this.state.date.split('/');
    const splitHour = this.state.hour.split(':');

    const title = `Uma tarefa se aproxima! #${taskId} - ${this.state.title.toUpperCase()}`;
    const body = this.state.annotation || this.state.title.toUpperCase();

    let type = 'calendar';
    const date = new Date();
    let weekday = 7;
    const day = Number(splitDate[0]);
    const month = Number(splitDate[1]);
    const year = Number(splitDate[2]);
    const hour = Number(splitHour[0]);
    let minute = Number(splitHour[1]);


    const currentTimeStamp = new Date();
    let minutesDiff = moment(`${this.state.date} ${this.state.hour}`, 'DD/MM/YYYY HH:mm')
      .diff(moment(currentTimeStamp, 'DD/MM/YYYY HH:mm'), 'minutes');

      
    if (minutesDiff <= 5) {
      type = 'now';
    } else {
      minute -= 5;
    }
    
    if ((this.state.dateType === 'today' || this.state.dateType === 'monthDay') 
      && type !== 'now') {
      type = 'date';

      date.setFullYear(year, month, day);
      date.setHours(hour - 3, minute, 0, 0);
    }

    if (this.state.dateType === 'mondayToFriday') {
      weekday = 5;
    }

    Notification(title, body, type, date, weekday, hour, minute, notificationCode => {
      const taskService = new TaskService();

      taskService.setNotificationCode(this.props.databaseConnection, taskId, notificationCode);
    });
  }

  onConfirm() {
    if (this.state.id) {
      this.confirmEditModal.setModalVisible();
    } 
    
    else {
      const { databaseConnection } = this.props;
      const taskService = new TaskService();

      taskService.insertTaskOnDatabase(databaseConnection, this.state, e => {
        if (e.status) {
          this.fetchTasks();
          this.sendNotification(e.insertId);
        }
      });


      if (this.props.onConfirm) {
        this.props.onConfirm();
      }
    }

    this.setModalInvisible();
  }

  onCancel() {
    const { language } = this.props;
    let message = 'Tem certeza que deseja descartar esta tarefa?';
    let task = Object.assign({}, this.state);

    if (language === 'E') {
      message = 'Are you sure you want to discard this task?';
    }

    delete task.isModalVisible;
    delete task.actualPageNumber;
    delete task.showHourPicker;
    delete task.showDatePicker;
    delete task.hourPickerValue;
    delete task.datePickerValue;

    if (this.state.originalTask && !isEqual(task, this.state.originalTask)) {
      message = `Tem certeza que deseja descartar as alterações na tarefa #${this.state.id}?`;
      
      if (language === 'E') {
        message = `Are you sure you want to discard changes to the task #${this.state.id}?`;
      }

      this.confirmCloseModal.setModalVisible(message);
    } 
    
    this.confirmCloseModal.setModalVisible(message);
  }
  
  render() {
    const { 
      language,
      headerBackgroundColor,
      titlesAndIconsColor,
    } = this.props;

    return (
      <View style={styles.centeredView}>
        <Modal visible={this.state.isModalVisible}
          animationType='slide'
          transparent >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { backgroundColor: headerBackgroundColor }]}>
              <View style={styles.headerView}>
                <Text style={styles.id}>{this.state.id && `#${this.state.id}`}</Text>

                <TouchableOpacity onPress={() => this.onCancel()}>
                  <FontAwesome5 name='times'
                    color='#f00'
                    size={25} />
                </TouchableOpacity>
              </View>

              <View style={styles.formView}>
                {this.renderForm()}
              </View>

              <View style={styles.footerView}>
                <Text style={[styles.pageNumbers, { color: titlesAndIconsColor }]}>
                  <Text style={styles.actualPageNumber}>
                    {this.state.actualPageNumber}
                  </Text>
                  {' / 5'}
                </Text>

                <View style={styles.viewFooterButtons}>
                  <TouchableOpacity onPress={() => this.previousForm()}>
                    <FontAwesome5 name='angle-left'
                      color='rgba(15, 146, 217, .7)'
                      size={40} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={async () => {
                    if (this.state.actualPageNumber < 5) {
                      this.nextForm();
                    } else {
                      this.onConfirm();
                    }
                  }}
                    style={styles.nextFormButton}>
                  <FontAwesome5 name={this.state.actualPageNumber === 5 ? 'check' : 'angle-right'}
                    color={this.state.actualPageNumber === 5 ? '#47d145' : 'rgb(15, 146, 217)'}
                    size={this.state.actualPageNumber === 5 ? 30 : 40} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <ConfirmationModal ref={e => this.confirmEditModal = e}
          message={
            language === 'P' ?
              `Tem certeza que deseja aplicar essas alterações na tarefa #${this.state.id}?`
            :
              `Are you sure you want to apply these changes to the task #${this.state.id}?`
          }
          onConfirm={() => {
            const { databaseConnection } = this.props;
            const taskService = new TaskService();

            taskService.updateTask(databaseConnection, this.state, () => this.fetchTasks());
          }} />

        <ConfirmationModal ref={e => this.confirmCloseModal = e}
          onConfirm={() => {
            this.setModalInvisible();
          }} />
      </View>
    );
  }
}

const modalHeight = () => {
  let modalHeight = '70%';
  
  if (devideHeight < 500) {
    modalHeight = devideHeight * 0.95;
  } else if (devideHeight < 600) {
    modalHeight = '95%';  
  }

  return modalHeight;
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: '90%',
    height: modalHeight(),

    margin: 20,
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  headerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },

  id: {
    color: '#585858',
    fontWeight: 'bold',
    opacity: 0.7,
  },
  
  formView: {
    flex: 8,
    padding: 10,
    width: '100%',
    height: '100%',
  },

  footerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },

  formContent: {
    width: '100%',
    height: '100%',
  },

  dialogText: {
    color: '#585858',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  titleFormView: {
    flex: 1,
    justifyContent: 'space-between',

    width: '100%',
  },
  
  titleInput: {
    width: '100%',
    height: 60,
  },

  annotationFormView: {
    flex: 1,
    justifyContent: 'space-between',

    width: '100%',
  },
  
  annotationInput: {
    minHeight: 80,
    height: '40%',
  },

  viewFooterButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nextFormButton: {
    marginLeft: 20,
  },

  viewPageCounter: {
    position: 'absolute',
    left: 5,
    bottom: 5,
  },

  pageNumbers: {
    fontSize: 16,
    color: '#585858',
  },

  actualPageNumber: {
    fontWeight: 'bold',
  },

  dateFormView: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  hourFormView: {
    flex: 2,
  },

  tagMarginRight: {
    marginRight: 10,
  },

  tagMarginTop: {
    marginTop: 10,
  },

  alarmFormView: {
    flex: 2,
    flexDirection: 'row',
  },

  colorFormView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const mapStateToProps = state => {
  const { 
    language,
    tasks, 
    databaseConnection,
    headerBackgroundColor, 
    titlesAndIconsColor 
  } = state;

  return {
    language,
    tasks,
    databaseConnection,
    headerBackgroundColor,
    titlesAndIconsColor,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setTasks: bindActionCreators(actions.setTasks, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
  },
)(TaskRegistrationModal);
