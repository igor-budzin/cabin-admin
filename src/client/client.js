import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { stringToBoolean } from 'universal/utils';
// Components
import App from './containers/AppContainer.js';
// Redux
import { Provider } from 'react-redux';
import createStore from '../universal/redux/createStore.js';
import { createBrowserHistory as createHistory } from 'history';

const history = createHistory();
const store = createStore(history);

window.audioInstance = document.createElement('audio');
window.audioInstance.preload = 'auto';
window.audioInstance.volume = localStorage.getItem('volume') !== null ? parseFloat(localStorage.getItem('volume')) : 0.5;;
window.audioInstance.muted = localStorage.getItem('isMuted') !== null ? stringToBoolean(localStorage.getItem('isMuted')) : false;


const renderApp = Component => {
  render(
    <AppContainer>
      <Provider store={store}>
        <Component history={history} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
}

renderApp(App);

// Hot reload
if (module.hot) {
  module.hot.accept('./containers/AppContainer.js', () => {
    const nextApp = require('./containers/AppContainer.js');
    renderApp(nextApp);
  });
}

