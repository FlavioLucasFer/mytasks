import React from 'react';
import { TouchableOpacity, View, Text, Dimensions, Animated, Easing, StyleSheet } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

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
    <TouchableOpacity>
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
    <TouchableOpacity>
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
      <TitledActionButton title='Feito'
        backgroundColor='#47d145'
        iconName='check'
        iconColor='lightgreen'
        iconSize={props.titledButtonIconSize}
        fontSize={props.titledButtonFontSize}
        paddingVertical={props.titledButtonPaddingVertical}
        paddingHorizontal={props.titledButtonPaddingHorizontal} 
        />

      <TitledActionButton title='Não feito'
        backgroundColor='#e83838'
        iconName='times'
        iconColor='#ff6666'
        iconSize={props.titledButtonIconSize}
        fontSize={props.titledButtonFontSize}
        paddingVertical={props.titledButtonPaddingVertical}
        paddingHorizontal={props.titledButtonPaddingHorizontal} 
        />

      <IconActionButton iconName='clone'
        backgroundColor='#3a8cf0'
        size={props.iconSize}
        paddingVertical={props.paddingVertical}
        paddingHorizontal={props.cloneIconPadding} />

      <IconActionButton iconName='edit'
        backgroundColor='#47d145'
        size={props.iconSize}
        paddingVertical={props.paddingVertical}
        paddingHorizontal={props.editIconPadding} />

      <IconActionButton iconName='trash-alt'
        backgroundColor='#ff6666'
        size={props.iconSize}
        paddingVertical={props.paddingVertical}
        paddingHorizontal={props.trashIconPadding} />
    </View>
  );
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

  onPressFavoriteButton() {
    if (this.props.onPressFavoriteButton) {
      this.props.onPressFavoriteButton(this.props.id, this.props.favorite === 'N' ? 'Y' : 'N');
    }
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

  render() {
    return (
      <View>
        <TouchableOpacity style={[styles.container, { backgroundColor: this.props.color }]}
          delayPressIn={0} 
          delayPressOut={0}
          onPress={() => {
            this.cardAnimation();
          }}>
          <View>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>
          
          <TouchableOpacity style={styles.heartIcon}
            onPress={() => {
              this.onPressFavoriteButton();
            }}>
            <FontAwesome name={this.props.favorite === 'Y' ? 'heart' : 'heart-o'} 
              color='red' 
              size={25} />
          </TouchableOpacity>
  
          <View style={styles.dateAlarmView}>
            <Text style={styles.dateTime}>{this.props.date} {this.props.hour}</Text>
  
            <FontAwesome5 name={this.props.alarm === 'Y' ? 'volume-up' : 'volume-mute'}
              color='#000'
              size={25}
              style={{ opacity: this.props.alarm === 'Y' ? 1 : 0.5 }} />
          </View>
          
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
  
        <ActionBar titledButtonIconSize={this.state.titledButtonIconSizeAnimation}
          titledButtonFontSize={this.state.titledButtonFontSizeAnimation}
          titledButtonPaddingVertical={this.state.titledButtonPaddingVAnimation}
          titledButtonPaddingHorizontal={this.state.titledButtonPaddingHAnimation}
          paddingVertical={this.state.actionButtonIconPaddingVAnimation}
          iconSize={this.state.actionButtonIconSizeAnimation}
          cloneIconPadding={this.state.actionButtonCloneIconPaddingHAnimation}
          editIconPadding={this.state.actionButtonEditIconPaddingHAnimation}
          trashIconPadding={this.state.actionButtonTrashIconPaddingHAnimation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
    width: cardWidth,
    elevation: 1,
    padding: 2,
    borderRadius: 5,
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

  dateTime: {
    marginRight: 10,
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

export default Card;
