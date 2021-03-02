import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { connect } from 'react-redux';

class ConfirmationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      message: '',
    };
  }

  setModalVisible(message = '') {
    this.setState({
      isModalVisible: true,
      message,
    });
  }

  setModalInvisible() {
    this.setState({
      isModalVisible: false,
      message: '',
    });
  }

  onConfirm() {
    this.setModalInvisible();

    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }

  onCancel() {
    this.setModalInvisible();

    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  render() {
    const {
      message,

      headerBackgroundColor,
      titlesAndIconsColor,
    } = this.props;

    return (
      <View style={styles.centeredView}>
        <Modal visible={this.state.isModalVisible}
          animationType='fade'
          transparent >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { backgroundColor: headerBackgroundColor }]}>
              <Text style={[styles.message, { color: titlesAndIconsColor }]}>
                {message || this.state.message}
              </Text>
              
              <View style={styles.buttonsContent}>
                <TouchableOpacity style={styles.cancelButton}
                  onPress={() => this.onCancel()}>
                  <FontAwesome5 name='times'
                    color='red'
                    size={25} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmButton}
                  onPress={() => this.onConfirm()}>
                  <FontAwesome5 name='check'
                    color='#47d145'
                    size={25} />
                </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },

  modalView: {
    width: '80%',
    minHeight: 100,

    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  message: {
    fontWeight: 'bold',
    textAlign: 'center',
  },

  buttonsContent: {
    display: 'flex',
    flexDirection: 'row',
    height: 50,
  },

  confirmButton: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(71, 209, 69, .3)',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  
  cancelButton: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    
    backgroundColor: 'rgba(255, 0, 0, .3)',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
});

const mapStateToProps = state => {
  const { headerBackgroundColor, titlesAndIconsColor } = state;

  return {
    headerBackgroundColor,
    titlesAndIconsColor,
  };
}

export default connect(
  mapStateToProps,
  null,
  null,
  {
    forwardRef: true,
  },
)(ConfirmationModal);
