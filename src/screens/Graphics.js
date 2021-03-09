import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

class Graphics extends React.Component {
  render() {
    return (
      <View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({

});

const mapStateToProps = state => {
  const {} = state;

  return {

  };
}

export default connect(
  mapStateToProps,
)(Graphics);
