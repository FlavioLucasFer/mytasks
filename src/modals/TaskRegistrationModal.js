import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import Input from '../components/Input';
import SelectableTag from '../components/SelectableTag';
import ColorBlock from '../components/ColorBlock';
import CardPreview, { BodyCardPreview, FooterCardPreview, HeaderCardPreview } from '../components/CardPreview';

const CardPreviewContainer = props => {
  const styles = StyleSheet.create({
    cardPreviewContainer: {
      padding: 5,
      backgroundColor: 'rgba(0, 0, 0, .1)',
      borderRadius: 5,
    },

    previewText: {
      color: '#585858',
      fontWeight: 'bold',
    },

    previewView: {
      height: props.height || 80,
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

  setModalVisible() {
    this.setState({
      isModalVisible: true,
    });
  }

  setModalInvisible() {
    this.setState(this.setStateClear());
  }

  insertTaskOnDatabase() {
    const task = Object.assign({}, this.state);

    const sql = `
      INSERT INTO task (title, annotation, date, hour, alarm, color)
      VALUES (
        '${task.title}'
        ,'${task.annotation}' 
        ,'${task.date}' 
        ,'${task.hour}' 
        ,'${task.alarm}'
        ,'${task.color}' 
      );
    `;

    const args = [
      task.title,
      task.annotation,
      task.dateType === 'today' || task.dateType === 'monthDay' ? task.date : task.dateType,
      task.hour,
      task.alarm,
      task.color,
    ];

    this.props.databaseConnection.transaction(tx => {
      tx.executeSql(sql, [], (e, i) => {
        console.log('[INSERT SUCCESS]', i);
        
        this.setState({
          id: i.insertId,
        });
      }, e => {
        console.log(`[ERROR ON INSERT TASK]`);
        console.log('[ERROR]: \n', e);
      });
    });
  }

  renderDialogText(text) {
    return <Text style={styles.dialogText}>{text}</Text>;
  }

  renderTitleForm() {
    return (
      <View style={styles.formContent}>
        {this.renderDialogText('Qual o título da sua tarefa?')}
        <View style={styles.titleFormView}>
          <View style={styles.titleInput}>
            <Input countCharLength
              maxLength={20}
              value={this.state.title}
              onChangeText={e => {
                this.setState({
                  title: e,
                });
              }} />
          </View>
          
          <CardPreviewContainer>
            <HeaderCardPreview title={this.state.title}
              color={this.state.color} />
          </CardPreviewContainer>
        </View>
      </View>
    );
  }
  
  renderAnnotationForm() {
    return (
      <View style={styles.formContent}>
        {this.renderDialogText('Que tal algumas anotações?')}
        <View style={styles.annotationFormView}>
          <View style={styles.annotationInput}>
            <Input countCharLength
              maxLength={135}
              multiline
              value={this.state.annotation}
              onChangeText={e => {
                this.setState({
                  annotation: e,
                });
              }} />
          </View>

          <CardPreviewContainer>
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

    return (
      <View style={styles.formContent}>
        {this.renderDialogText('Essa tarefa é pra quando?')}
        <View style={styles.dateFormView}>
          <View style={styles.tagMarginRight}>
            <SelectableTag title='Hoje'
              selected={dateType === 'today'}
              onLongPress={() => this.setState({ 
                dateType: 'today',
                date: moment().format('DD/MM/YYYY'),
              })} />
          </View>

          <View style={styles.tagMarginRight}>
            <SelectableTag title='Seg. a Sex.'
              selected={dateType === 'mondayToFriday'}
              onLongPress={() => this.setState({ 
                dateType: 'mondayToFriday',
                date: 'SEG. A SEX.',
              })} />
          </View>

          <View style={styles.tagMarginRight}>
            <SelectableTag title='Todos os dias'
              selected={dateType === 'everydays'}
              onLongPress={() => this.setState({ 
                dateType: 'everydays',
                date: 'TODOS OS DIAS',
              })} />
          </View>

          <View style={styles.tagMarginTop}>
            <SelectableTag title={`Dia do mês${date && dateType === 'monthDay' ? ': ' + date : ''}`}
              selected={dateType === 'monthDay'}
              onLongPress={() => {
                this.setState({ 
                  dateType: 'monthDay',
                  showDatePicker: true,
                });
              }} />
          </View>
        </View>

        {this.renderDialogText('E o horário?')}
        <View style={styles.hourFormView}>
          <SelectableTag title={this.state.hour}
            onPress={() => this.setState({ showHourPicker: true })} />

            {this.renderDateHourPicker()}
        </View>

        {this.renderDialogText('Quer que eu toque pra te lembrar?')}
        <View style={styles.alarmFormView}>
          <View style={styles.tagMarginRight}>
            <SelectableTag title='Sim'
              selected={this.state.alarm === 'Y'}
              onLongPress={() => this.setState({ alarm: 'Y' })} />
          </View>

          <SelectableTag title='Não'
            selected={this.state.alarm === 'N'}
            onLongPress={() => this.setState({ alarm: 'N' })} />
        </View>

        <CardPreviewContainer height={35}>
          <FooterCardPreview date={this.state.date}
            hour={this.state.hour}
            alarm={this.state.alarm === 'Y'}
            color={this.state.color} />
        </CardPreviewContainer>
      </View>
    );
    
  }
  
  renderColorForm() {
    const { color } = this.state;

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
        {this.renderDialogText('Pra finalizar, que tal uma cor?')}
        <View style={styles.colorFormView}>
          {colors.map(e => (
              <View style={[styles.tagMarginRight, styles.tagMarginTop]}>
                <ColorBlock backgroundColor={e}
                  selected={color === e}
                  onPress={() => this.setState({ color: e })} />
              </View> 
          ))}

        </View>

        <CardPreviewContainer>
          <HeaderCardPreview title={this.state.title}
            color={this.state.color} />
        </CardPreviewContainer>
      </View>
    );
  }

  renderConfirmForm() {
    return (
      <View style={styles.formContent}>
        <CardPreview title={this.state.title}
          annotation={this.state.annotation}
          date={this.state.date}
          hour={this.state.hour}
          alarm={this.state.alarm === 'Y'}
          color={this.state.color} />
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

  onConfirm() {
    this.insertTaskOnDatabase();
    
    let task = Object.assign({}, this.state);

    delete task.isModalVisible;
    delete task.actualPageNumber;
    delete task.showHourPicker;
    delete task.showDatePicker;
    delete task.hourPickerValue;
    delete task.datePickerValue;

    if (this.props.onConfirm) {
      this.setModalInvisible();
      return this.props.onConfirm(task);
    }

  }
  
  render() {
    return (
      <View style={styles.centeredView}>
        <Modal visible={this.state.isModalVisible}
          animationType='slide'
          transparent >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.headerView}>
                  <TouchableOpacity onPress={() => this.setModalInvisible()}>
                    <FontAwesome5 name='times'
                      color='#f00'
                      size={25} />
                  </TouchableOpacity>
                </View>

                <View style={styles.formView}>
                  {this.renderForm()}
                </View>

                <View style={styles.footerView}>
                  <Text style={styles.pageNumbers}>
                    <Text style={styles.actualPageNumber}>{this.state.actualPageNumber}</Text>
                    {' / 5'}
                  </Text>

                  <View style={styles.viewFooterButtons}>
                    <TouchableOpacity onPress={() => this.previousForm()}>
                      <FontAwesome5 name='angle-left'
                        color='rgba(15, 146, 217, .7)'
                        size={40} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: '90%',
    height: '60%',

    margin: 20,
    backgroundColor: '#fff',
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
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
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
    fontSize: 20,
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

export default TaskRegistrationModal;
