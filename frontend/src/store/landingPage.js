import { createSelector } from "reselect";
// import { csrfFetch } from "./csrf";

// Action Types
export const SET_SPOTS = 'SET_SPOTS';

// Action Creators
export const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

// Selector
export const spotsSelector = createSelector(
  (state) => state.spots,
  (allspots) => Object.values(allspots)
);



//Thunk Action 
export const loadSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  const spots = await response.json();
  dispatch(setSpots(spots));
  return response;
};




// Initial State
const initialState = { spots: [], };

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return {
        ...state,
        spots: action.payload,
      };    
    default:
      return state;
  }
};

export default spotsReducer;

