import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const ColorBlock = props => {
  const { backgroundColor, selected } = props;

  const styles = StyleSheet.create({
    container: {
      borderColor: selected ? 'rgb(15, 146, 217)' : 'transparent',
      borderWidth: 2,
      borderRadius: 5,
    },

    colorView: {
      height: 50,
      width: 50,
      borderRadius: 5,

      backgroundColor,
    },
  });

  return (
    <TouchableOpacity {...props}
      style={styles.container}>
      <View style={styles.colorView} />
    </TouchableOpacity>
  );
};


export default ColorBlock;
