import { csrfFetch } from "./csrf"; 

// Action Types
export const SET_SPOTS = 'SET_SPOTS';
export const REMOVE_SPOT = 'REMOVE_SPOT';
export const SET_SPOT_DETAILS = 'SET_SPOT_DETAILS';

// Action Creators
export const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  payload: spotId,
});

const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  payload: spot,
});

// Thunk Actions
export const loadSpots = () => async (dispatch) => {
  try {
    const response = await fetch('/api/spots');
    if (response.ok) {
      const data = await response.json();
      dispatch(setSpots(data.Spots));
    } else {
      console.error('Failed to load spots:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching spots:', error);
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      dispatch(removeSpot(spotId)); 
    } else {
      console.error('Failed to delete spot:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting spot:', error);
  }
};

export const loadDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const spot = await response.json();
      dispatch(setSpotDetails(spot));
    } else {
      console.error('Failed to load spot details:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching spot details:', error);
  }
};

// Initial State
const initialState = { spots: [], details: null };

// Reducer
const spotsReducer = (state = initialState, action) => {
  console.log("Action received:", action);
  switch (action.type) {
    case SET_SPOTS:
      return {
        ...state,
        spots: action.payload,
      };
    case REMOVE_SPOT:
      return {
        ...state,
        spots: state.spots.filter(spot => spot.id !== action.payload),
      };
    case SET_SPOT_DETAILS:
      return {
        ...state,
        details: action.payload,
      };
    default:
      return state;
  }
};

export default spotsReducer;




