// Action Types
export const SET_SPOTS = 'SET_SPOTS';

// Action Creators
export const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

//Thunk Action 
export const loadSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpots(data.Spots));
  }
}

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
