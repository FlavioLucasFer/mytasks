import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

const HeaderCardPreview = props => {
  const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      elevation: 1,
      backgroundColor: props.color,
      padding: 2,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    },

    heartIcon: {
      position: 'absolute',
      top: 3,
      right: 3,
    },

    title: {
      width: '100%',
      height: '100%',

      position: 'absolute',
      top: 0,

      textAlignVertical: 'center',
      textAlign: 'center',

      textTransform: 'uppercase',
      fontWeight: 'bold',
      fontSize: 16,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -0.5, height: -0.5 },
      textShadowRadius: 1,
    },
  });

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>

      <FontAwesome name='heart-o'
        color='red'
        size={20}
        style={styles.heartIcon} />
    </View>
  );
};

const BodyCardPreview = props => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: props.color,
      width: '100%',
      height: '100%',
    },
    
    annotationView: {
      width: '100%',
      height: '100%',
      padding: 5,
      marginTop: 5,
    },

    divisionLine: {
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
      opacity: 0.2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.divisionLine} />

      <View style={styles.annotationView}>
        <Text numberOfLines={3}>
          {props.annotation}
        </Text>
      </View>
    </View>
  );
};

const FooterCardPreview = props => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: props.color,
      width: '100%',
      height: '100%',
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
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
      // marginRight: 10,
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.dateAlarmView}>
        <Text style={styles.dateTime}>{props.date} {props.hour}</Text>

        {/* <FontAwesome5 name={props.alarm ? 'volume-up' : 'volume-mute'}
          color='#000'
          size={20}
          style={{ opacity: props.alarm ? 1 : 0.5 }} /> */}
      </View>
    </View>
  );
};

const CardPreview = props => {
  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <HeaderCardPreview {...props} />
      </View>
      {!props.disableBody ?
        <View style={styles.bodyView}>
          <BodyCardPreview {...props} />
        </View>
      : null}
      <View style={styles.footerView}>
        <FooterCardPreview {...props} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerView: {
    flex: 2,
  },

  bodyView: {
    flex: 7,
  },

  footerView: {
    flex: 1,
  },
});

export default CardPreview;

export {
  HeaderCardPreview,
  BodyCardPreview,
  FooterCardPreview,
};
