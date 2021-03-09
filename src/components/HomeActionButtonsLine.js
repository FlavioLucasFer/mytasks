import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';

import TaskRegistrationModal from '../modals/TaskRegistrationModal';

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5);

class HomeActionButtonsLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonsVisible: false,

      timerButtonMarginRightAnimation: new Animated.Value(0),
      buttonSizeAnimation: new Animated.Value(0),
      iconSizeAnimation: new Animated.Value(0),
    };
  }

  buttonsAnimation() {
    const { buttonsVisible } = this.state;

    const duration = 100;

    Animated.timing(this.state.timerButtonMarginRightAnimation, {
      toValue: buttonsVisible ? 0 : 10,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.buttonSizeAnimation, {
      toValue: buttonsVisible ? 0 : 50,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.iconSizeAnimation, {
      toValue: buttonsVisible ? 0 : 25,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,      
    }).start();

    this.setState({ buttonsVisible: !buttonsVisible });
  }

  render() {
    const { multiSelect, systemBlue, systemRed } = this.props;

    let iconName = 'play';

    if (multiSelect) {
      iconName = 'trash-alt';
    }

    return (
      <View style={[
          styles.container, 
          { width: this.state.buttonsVisible ? 140 : 80 },
        ]}>
        <TouchableOpacity style={styles.newTaskButton}
          onPress={() => {
            this.taskRegistrationModal.setModalVisible();
          }}>
  
          <FontAwesome5 name='plus'
            color='#fff'
            size={30} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => {
            this.buttonsAnimation();
            
            if (multiSelect) {
              if (this.props.onPressDelete) {
                this.props.onPressDelete();
              }
            } 
            
            else {
              if (this.props.onStartTaskTimeCounter) {
                this.props.onStartTaskTimeCounter();
              }
            }
            
          }}>

          <Animated.View style={[
              styles.timerButton,
              {
                width: this.state.buttonSizeAnimation,
                height: this.state.buttonSizeAnimation,
                marginRight: this.state.timerButtonMarginRightAnimation,
                backgroundColor: !multiSelect ? systemBlue : systemRed,
              },
            ]}>
              
            <AnimatedIcon name={iconName}
              color='#fff'
              size={this.state.iconSizeAnimation} />
          </Animated.View>
  
        </TouchableOpacity>

        <TaskRegistrationModal ref={e => this.taskRegistrationModal = e}
          onConfirmAfterFetch={this.props.onConfirmNewTaskAfterFetch} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',

    position: 'absolute',
    elevation: 3,
    bottom: 20,
    right: 5,
    paddingHorizontal: 10,
  },

  newTaskButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#47d145',
    borderRadius: 50,
    elevation: 3,
    height: 60,
    width: 60,
  },

  timerButton: {
    elevation: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 50,
  },
});

const mapStateToProps = state => {
  const { systemBlue, systemRed, selectedTask, taskTimeCounter } = state;

  return {
    systemBlue,
    systemRed,
    selectedTask,
    taskTimeCounter,
  };
}

export default connect(
  mapStateToProps,
  null,
  null,
  {
    forwardRef: true,
  },
)(HomeActionButtonsLine);
