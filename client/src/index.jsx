<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import MainView from './components/main-view/main-view';
import moviesApp from './reducers/reducers';

// Import statement to indicate that we need to bundle `./index.scss`
import './index.scss';

const store = createStore(moviesApp);

// Main component (will eventually use all the others)
class MyFlixApplication extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

// Find the root of our app
const container = document.getElementsByClassName('app-container')[0];

// Tell React to render our app in the root DOM element
ReactDOM.render(React.createElement(MyFlixApplication), container);
=======
import React from 'react';
import ReactDOM from 'react-dom';

// imports for files to bundle
import './index.scss';

// import components
import { MainView } from './components/main-view/main-view';

// main component
class SoFlixApplication extends React.Component {
  render() {
    return (<MainView /> );
  }
}

// root element of the app
const container = document.getElementsByClassName('app-container')[0];

// set app root DOM element
ReactDOM.render(React.createElement(SoFlixApplication), container);
>>>>>>> b75f8a2ebb77f50d284f258fcc2a418b0847c0c9
