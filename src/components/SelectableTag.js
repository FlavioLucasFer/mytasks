import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SelectableTag = props => {
  const { title, selected, unSelectedColor } = props;
  
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  
      padding: 10,
      height: 35,
  
      borderColor: selected ? 'rgb(15, 146, 217)' : unSelectedColor || '#585858',
      borderWidth: 2,
      borderRadius: 5,

      backgroundColor: selected ? 'rgb(15, 146, 217)' : 'transparent',
    },
  
    title: {
      color: selected ? '#fff' : unSelectedColor || '#585858',
      fontWeight: 'bold',
    },
  });

  return (
    <TouchableOpacity {...props}
      style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};


export default SelectableTag;
