import { csrfFetch } from "./csrf";


// Action Types
export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';

//Action Creators
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

//Thunk
export const loginUser = (userData) => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};
    
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/session')
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};
    
export const signup = (user) => async (dispatch) => {
    const { firstName, lastName, username, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        email,
        password
      })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};
  
export const logoutUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE'
  });  
  dispatch(removeUser());
  return response;
};

//Initial State
const initialState = {user: null,};
  

// Reducer
const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_USER: 
      return {
        ...state,
        user: action.payload,
        };
        case REMOVE_USER:
            return {
                ...state,
                user: null,
            };
        default:
            return state;
  }
};

export default sessionReducer;