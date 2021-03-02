import React from 'react';
import { Modal, View, Text, FlatList, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

const MenuButton = props => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 10,
    },
  });

  return (
    <View style={styles.container} 
      key={props.key}>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={{ color: props.titleColor || '#f00' }}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
}

class MenuModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
    };
  }

  setModalVisible() {
    this.setState({
      isModalVisible: true,
    });
  }

  setModalInvisible() {
    this.setState({
      isModalVisible: false,
    });
  }

  onPressConfig() {
    const { language } = this.props;

    this.setModalInvisible();

    Actions.userconfigs({ title: language === 'P' ? 'Configurações' : 'Settings' });
  }
  
  onPressAbout() {
    const { language } = this.props;

    this.setModalInvisible();

    Actions.aboutapp({ title: language === 'P' ? 'Sobre' : 'About' });
  }

  renderMenuButtons() {
    const { language } = this.props;

    return [
      {
      title: language === 'P' ? 'Configurações' : 'Settings',
      onPress: () => this.onPressConfig(),
      }, {
        title: language === 'P' ? 'Sobre' : 'About',
        onPress: () => this.onPressAbout(),
      }
    ];
  }

  render() {
    return (
      <View>
        <Modal visible={this.state.isModalVisible}
          animationType='fade'
          transparent
          onRequestClose={() => this.setModalInvisible()} >
          <TouchableWithoutFeedback style={styles.centeredView}
            onPress={() => this.setModalInvisible()}>
            <View style={styles.positionModalRight}>
              <View style={[styles.modalView, { backgroundColor: this.props.headerBackgroundColor }]}>
                <FlatList data={this.renderMenuButtons()}
                  renderItem={({ item }) => (
                    <MenuButton key={item.title} 
                      title={item.title}
                      titleColor={this.props.titlesAndIconsColor}
                      onPress={() => item.onPress()} />
                  )} />
              </View>
            </View>
          </TouchableWithoutFeedback>
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

  positionModalRight: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    margin: 35,
  },

  modalView: {
    minWidth: 120,
    minHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    paddingVertical: 10,
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
});

const mapStateToProps = state => {
  const { 
    language,    
    headerBackgroundColor, 
    titlesAndIconsColor 
  } = state;

  return {
    language,
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
)(MenuModal);
