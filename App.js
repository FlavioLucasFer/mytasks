import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Routes from './Routes';

import reducer from './src/redux/reducers';

const store = createStore(reducer);

const App = () => { 
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default App;
