import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'; // Use named import for consistency

const rootReducer = combineReducers({
  // ADD REDUCERS HERE
});

const configureStore = (preloadedState) => {
  const middleware = [thunk];

  if (import.meta.env.MODE !== "production") {
    const logger = createLogger();
    middleware.push(logger);
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(applyMiddleware(...middleware));

  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;

