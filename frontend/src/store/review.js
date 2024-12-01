
import { csrfFetch } from "./csrf";
import {loadDetails} from "./landingPage";

// Action Types
export const SET_REVIEWS = 'SET_REVIEWS';
export const ADD_REVIEW = 'ADD_REVIEW';
export const REMOVE_REVIEW = 'REMOVE_REVIEW';
export const REVIEW_POST_OK = 'REVIEW_POST_OK';
export const REVIEW_POST_ERR = 'REVIEW_POST_ERR';
export const UPDATE_REVIEW = 'UPDATE_REVIEW'

// Action Creators
const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  payload: reviews,
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId
});

const reviewPostErr = (error) => ({
  type: REVIEW_POST_ERR,
  payload: error,
});

const updatedReviews = (review) => ({
  type: UPDATE_REVIEW,
  payload: review,
});


// Thunk Actions 
export const loadReviews = (spotId) => async (dispatch) => { 
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
      const data = await response.json();
      // console.log('Fetched reviews:', data.Reviews); // Check this output
      dispatch(setReviews(data.Reviews || [])); // Use 'data.Reviews' instead of 'data.reviews'
  } else {
      const error = await response.json();
      dispatch(reviewPostErr(error));
  }
};


export const createReview = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData), // Send review data correctly
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(addReview(newReview)); // Dispatch the new review to the store
    dispatch(loadReviews(spotId)); // Reload reviews for the spot
    dispatch(loadDetails(spotId)); // Optionally reload spot details
    return newReview;
  } else {
    const error = await response.json();
    dispatch(reviewPostErr(error));
    throw error; // Throw error to handle in component
  }
};



export const deleteReview = (reviewId, spotId) => async (dispatch) => {
  const response = await csrfFetch(`api/reviews/${reviewId}`, {
      method: 'DELETE',
  });

  if (response.ok) {
      dispatch(removeReview(reviewId));
      dispatch(loadDetails(spotId));
      dispatch(loadReviews(spotId));
  } else {
      const error = await response.json();
      throw error;
  }
};

export const editReviews = (reviewId, updatedReview) => async (dispatch) => {
  const response = await csrfFetch(`/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedReview)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updatedReviews(data.Reviews))
  } else {
    const error = await response.json();
    dispatch(reviewPostErr(error));
    throw error;
  }
};



// Initial State
const initialState = {
  reviews: [],
  error: null,
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
      case SET_REVIEWS:
          return { ...state, reviews: action.payload, error: null };
      case ADD_REVIEW:
          return { ...state, reviews: [action.payload, ...state.reviews], error: null };
      case REMOVE_REVIEW:
          return {
              ...state,
              reviews: state.reviews.filter(review => review.id !== action.reviewId),
              error: null,
          };
      case REVIEW_POST_ERR:
          return { ...state, error: action.payload };
          case UPDATE_REVIEW:
  return {
    ...state,
    reviews: state.reviews.map((review) =>
      review.id === action.payload.id ? action.payload : review
    ),
  };

      default:
          return state;
  }
};

export default reviewsReducer;
