import { csrfFetch } from "./csrf";

// Action Types
export const SET_REVIEWS = 'SET_REVIEWS';
export const REMOVE_REVIEWS ='REMOVE_REVIEWS'


// Action Creators
const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  payload: reviews,
});
const removeReviews = () => ({
    type: REMOVE_REVIEWS,
})

//Thunk Action 
export const loadReviews = () => async (dispatch) => {
  const response = await fetch('/api/spots/${spotId}/reviews');
  if (response.ok) {
    const data = await response.json();
    dispatch(setReviews(data.revivews));
  }
}

export const deleteReviews = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/${spotId}/reviews', {
      method: 'DELETE'
    });  
    dispatch(removeReviews());
    return response;
  };

// Initial State
const initialState = { reviews: [],};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return {
        ...state,
        reviews: action.payload,
      };
    default:
      return state;
  }
};

export default reviewsReducer;

