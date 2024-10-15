// import { csrfFetch } from './csrf';


const allSpots = (spots) => ({
    type: ALL_SPOTS,
    payload: spots,
})
export const ALL_SPOTS = 'ALL_SPOTS';


export const LandingPage = () => async (dispatch) => {
    const response = await fetch('/api/spots')
    const data = await response.json();
    dispatch(allSpots(data.spots));
    return response;
}


const initialState = { spots: [], };

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALL_SPOTS:
            return {
                ...state,
                spots: action.payload,
            };
        default:
            return state;
    }
};

export default spotsReducer;