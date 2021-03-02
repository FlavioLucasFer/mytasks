import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

class AboutApp extends React.Component {
  render() {
    const { language, titlesAndIconsColor } = this.props;

    return (
      <View style={styles.container}>
        <View>
          <Text style={[styles.text, { color: titlesAndIconsColor }]}>
            {language === 'P' ? 'Versão' : 'Version'}: 
            Beta 1.0
          </Text>

          <Text style={[styles.text, { color: titlesAndIconsColor }]}>
            {language === 'P' ? 'Atualizado em' : 'Updated at'}: 
            19/02/2020
          </Text>
          
          <Text style={[styles.text, { color: titlesAndIconsColor }]}>
            {language === 'P' ? 'Desenvolvi por' : 'Developed by'}: 
            Flavio Lucas Fernandes
          </Text>
        </View>

        <View style={styles.attNotesView}>
          <Text style={[styles.attNotes, { color: titlesAndIconsColor }]}>
            {language === 'P' ? 'Notas de Atualização' : 'Update Notes'}
          </Text>
          <Text style={[styles.text, { color: titlesAndIconsColor }]}>
            Beta 1.0
          </Text>

          <View style={styles.notesView}>
            {/* <Text>teste</Text> */}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },

  text: {
    fontSize: 16,
  },

  attNotesView: {
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    marginTop: 20,
  },

  attNotes: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  notesView: {
    backgroundColor: 'rgba(232, 232, 232, .5)',
    width: '100%',
    height: '86%',
    borderRadius: 15,
    padding: 5,
    marginTop: 5,
  },
});

const mapStateToProps = state => {
  const { language, titlesAndIconsColor } = state;

  return {
    language,
    titlesAndIconsColor,
  };
}

export default connect(
  mapStateToProps,
)(AboutApp);
