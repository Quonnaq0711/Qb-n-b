import { csrfFetch } from "./csrf";

// Action Types
export const SET_REVIEWS = 'SET_REVIEWS';
export const ADD_REVIEW = 'ADD_REVIEW';
export const REMOVE_REVIEWS = 'REMOVE_REVIEWS';

// Action Creators
const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  payload: reviews,
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

const removeReviews = () => ({
  type: REMOVE_REVIEWS,
});

// Thunk Actions 
export const loadReviews = (spotId) => async (dispatch) => { 
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
      const data = await response.json();
      console.log('Fetched reviews:', data.reviews); // Check this output
      dispatch(setReviews(data.reviews));
      return response;
  }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(addReview(newReview)); // Dispatch the new review to the store
    return newReview;
  }
};

export const deleteReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'DELETE',
  });  
  if (response.ok) {
    dispatch(removeReviews());
  }
  return response;
};

// Initial State
const initialState = { reviews: [], };

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
      case SET_REVIEWS:
          return {
              ...state,
              reviews: action.payload,
          };
      case ADD_REVIEW:
          return {
              ...state,
              reviews: [action.payload, ...state.reviews], // Add new review to the top
          };
      case REMOVE_REVIEWS:
          return initialState; // Resets the reviews to initial state
      default:
          return state; // Ensure you return the current state for unhandled actions
  }
};

export default reviewsReducer;





