import { combineReducers } from 'redux';

import { SET_FILTER, SET_MOVIES, SET_LOGGED_USER } from '../actions/actions';

function visibilityFilter(state = '', action) {
  switch (action.type) {
    case SET_FILTER:
      return action.value;
    default:
      return state;
  }
}

function movies(state = [], action) {
  switch (action.type) {
    case SET_MOVIES:
      return action.value;
    default:
      return state;
  }
}

function loggedUser(state = [], action) {
  switch (action.type) {
    case SET_LOGGED_USER:
      return action.value;
    default:
      return state;
  }
}

const moviesApp = combineReducers({
  visibilityFilter,
  movies,
  loggedUser
});

export default moviesApp;