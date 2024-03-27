// src/store/index.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

// Import your reducers
import someReducer from './reducers/someReducer';

// Combine them if you have more than one
const rootReducer = combineReducers({
  some: someReducer,
});

// Create the store
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
