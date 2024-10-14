
import { useReducer, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import blogService from './services/blogs';


const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'CLEAR':
      return null;
    default:
      return state;
  }
};


const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};


UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export const useUserValue = () => {
  const { user } = useContext(UserContext);
  return user;
};

export const useUserDispatch = () => {
  const { dispatch } = useContext(UserContext);
  return dispatch;
};


export const initializeUser = (dispatch) => {
  const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'));
  if (loggedUser) {
    dispatch({ type: 'SET', payload: loggedUser });
    blogService.setToken(loggedUser.token);
  }
};
