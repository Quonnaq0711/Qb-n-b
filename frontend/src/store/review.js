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


// Selector
// export const spotsSelector = createSelector(
//   (state) => state.spots.spots,
//   (allspots) => Object.values(allspots)
// );



//Thunk Action 
export const loadReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const reviews = await response.json();
  dispatch(setReviews(reviews));
  return response;
};

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

