import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'; // Use named import for consistency
import sessionReducer from './session';
import spotsReducer from './landingPage';
import reviewsReducer from './review';


const rootReducer = combineReducers({
  // ADD REDUCERS HERE
  session: sessionReducer,
  spots: spotsReducer,
  reviews:reviewsReducer,
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

