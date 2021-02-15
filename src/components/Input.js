import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const Input = props => {
  const { countCharLength, value, maxLength, backgroundColor, multiline } = props;

  let charNearToMaxPercentage = 0;
  let charLengthTextColor = '#47d145';

  if (countCharLength) {
    charNearToMaxPercentage = (value.length * 100) / maxLength;
  }

  if (charNearToMaxPercentage >= 70) {
    charLengthTextColor = '#ede515';
  } 
  
  if (countCharLength && value.length === maxLength) {
    charLengthTextColor = '#ff6666';
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',

      width: '100%',
      height: '100%',
    },
  
    textInput: {
      width: '100%',
      textAlignVertical: multiline ? 'top' : 'center',
      height: countCharLength ? '95%' : '100%',
      
      backgroundColor: backgroundColor || 'transparent',
      borderColor: 'rgba(88, 88, 88, .5)',
      borderWidth: 2,
      borderRadius: 5,
      
      fontSize: multiline ? 16 : 20,
      color: '#000',
      paddingVertical: multiline ? 15 : 0,
      paddingHorizontal: 15,
    },

    charLengthText: {
      color:  charLengthTextColor,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <TextInput {...props}
        style={styles.textInput} />
        
      {countCharLength ?
        <Text style={styles.charLengthText}>{value.length}/{maxLength}</Text>
      : null} 
    </View>
  );
}


export default Input;
