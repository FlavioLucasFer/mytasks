import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Home from './src/screens/Home';

const Routes = () => {
  return (
    <Router sceneStyle={{ backgroundColor: '#f7f7f7' }}>
      <Scene key='root'>
        <Scene key='home'
          component={Home}
          initial />
      </Scene>
    </Router>
  );
};

export default Routes;
