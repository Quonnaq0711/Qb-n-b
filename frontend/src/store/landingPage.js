import { csrfFetch } from "./csrf"; 

// Action Types
export const SET_SPOTS = 'SET_SPOTS';
export const REMOVE_SPOT = 'REMOVE_SPOT';
export const SET_SPOT_DETAILS = 'SET_SPOT_DETAILS';
export const UPDATE_SPOT = 'UPDATE_SPOT';

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

const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  payload: spot,
});

// Thunk Actions
export const loadSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpots(data.Spots));
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
  const response = await fetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json(); 
    dispatch(setSpotDetails(spot));
  }
};

export const updateDetails = (spotId, updatedSpot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedSpot), // Send updated data to backend
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(updateSpot(data)); // Dispatch the updated spot after successful response
  }
};

// Initial State
const initialState = { spots: [], details: null };

// Reducer
const spotsReducer = (state = initialState, action) => {
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
    case UPDATE_SPOT:
      return {
        ...state,
        spots: state.spots.map((spot) =>
          spot.id === action.payload.id ? action.payload : spot
        ),
        details: action.payload, // Also update the details if required
      };
    default:
      return state;
  }
};

export default spotsReducer;





